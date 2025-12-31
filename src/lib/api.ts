const API_URLS = {
  auth: 'https://functions.poehali.dev/167a0b83-54c6-4633-b7bb-fcb4980138db',
  bookings: 'https://functions.poehali.dev/3dbee73c-614c-4e39-b4cc-23cc87992acd',
  admin: 'https://functions.poehali.dev/01621918-0e10-4f1d-a17d-09c071eafdf0'
};

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'client' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Booking {
  id: number;
  from_location: string;
  to_location: string;
  travel_date: string;
  travel_time: string;
  passengers: number;
  tariff_name?: string;
  category?: string;
  total_price: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  phone?: string;
}

class ApiClient {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URLS.auth}?action=register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URLS.auth}?action=login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  async createBooking(data: {
    guest_name?: string;
    guest_phone?: string;
    guest_email?: string;
    from_location: string;
    to_location: string;
    travel_date: string;
    travel_time: string;
    passengers: number;
    tariff_id: number;
    payment_method: string;
    notes?: string;
  }): Promise<any> {
    const response = await fetch(API_URLS.bookings, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }

    return response.json();
  }

  async getBookings(): Promise<{ bookings: Booking[] }> {
    const response = await fetch(API_URLS.bookings, {
      method: 'GET',
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bookings');
    }

    return response.json();
  }

  async updateBooking(id: number, data: {
    status?: string;
    payment_status?: string;
    vehicle_id?: number;
    notes?: string;
  }): Promise<any> {
    const response = await fetch(`${API_URLS.bookings}?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update booking');
    }

    return response.json();
  }

  async cancelBooking(id: number): Promise<any> {
    const response = await fetch(`${API_URLS.bookings}?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel booking');
    }

    return response.json();
  }

  async getAdminStats(): Promise<any> {
    const response = await fetch(`${API_URLS.admin}?resource=stats`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch statistics');
    }

    return response.json();
  }

  async getTariffs(): Promise<any> {
    const response = await fetch(`${API_URLS.admin}?resource=tariffs`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch tariffs');
    }

    return response.json();
  }

  async updateTariff(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_URLS.admin}?resource=tariffs&id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update tariff');
    }

    return response.json();
  }

  async getVehicles(): Promise<any> {
    const response = await fetch(`${API_URLS.admin}?resource=vehicles`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch vehicles');
    }

    return response.json();
  }

  async updateVehicle(id: number, data: any): Promise<any> {
    const response = await fetch(`${API_URLS.admin}?resource=vehicles&id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update vehicle');
    }

    return response.json();
  }
}

export const api = new ApiClient();
