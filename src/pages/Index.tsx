import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const cars = [
    {
      name: 'Toyota Vellfire',
      category: 'VIP',
      seats: 7,
      price: 'от 5000 ₽',
      image: 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/0ada021e-a637-4aeb-aa3b-ffede31e3539.jpg',
      features: ['Кожаный салон', 'Климат-контроль', 'Wi-Fi']
    },
    {
      name: 'Toyota Voxy',
      category: 'Комфорт',
      seats: 7,
      price: 'от 3500 ₽',
      image: 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/0ada021e-a637-4aeb-aa3b-ffede31e3539.jpg',
      features: ['Просторный салон', 'Кондиционер', 'USB порты']
    },
    {
      name: 'Toyota Prius',
      category: 'Эконом',
      seats: 4,
      price: 'от 2000 ₽',
      image: 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/f2754206-df7c-43ee-9d66-d32c146aa2e4.jpg',
      features: ['Гибрид', 'Экономичный', 'Комфортный']
    },
    {
      name: 'Honda StepWagn',
      category: 'Комфорт',
      seats: 7,
      price: 'от 3500 ₽',
      image: 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/0ada021e-a637-4aeb-aa3b-ffede31e3539.jpg',
      features: ['Семейный', 'Багажник', 'Безопасность']
    },
    {
      name: 'Hyundai Solaris',
      category: 'Эконом',
      seats: 4,
      price: 'от 1800 ₽',
      image: 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/f2754206-df7c-43ee-9d66-d32c146aa2e4.jpg',
      features: ['Надёжный', 'Бюджетный', 'Городской']
    },
    {
      name: 'Volkswagen Polo',
      category: 'Эконом',
      seats: 4,
      price: 'от 1800 ₽',
      image: 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/f2754206-df7c-43ee-9d66-d32c146aa2e4.jpg',
      features: ['Немецкое качество', 'Экономичный', 'Надёжный']
    }
  ];

  const tariffs = [
    {
      name: 'Эконом',
      price: '1800',
      description: 'Комфортные седаны для повседневных поездок',
      features: ['До 4 пассажиров', 'Кондиционер', 'Опытный водитель', 'Чистый автомобиль'],
      icon: 'Car'
    },
    {
      name: 'Комфорт',
      price: '3500',
      description: 'Просторные минивэны для семейных поездок',
      features: ['До 7 пассажиров', 'Багажное отделение', 'Детские кресла', 'Wi-Fi на борту'],
      icon: 'Armchair',
      popular: true
    },
    {
      name: 'VIP',
      price: '5000',
      description: 'Премиальные автомобили для особых случаев',
      features: ['Бизнес-класс', 'Кожаный салон', 'Персональный сервис', 'Напитки в салоне'],
      icon: 'Crown'
    }
  ];

  const routes = [
    { from: 'Аэропорт Сочи', to: 'Гагра', time: '1.5 ч', price: '3500 ₽' },
    { from: 'Аэропорт Сочи', to: 'Пицунда', time: '2 ч', price: '4000 ₽' },
    { from: 'Аэропорт Сочи', to: 'Сухум', time: '3 ч', price: '5000 ₽' },
    { from: 'Гагра', to: 'Новый Афон', time: '1 ч', price: '2000 ₽' },
    { from: 'Сухум', to: 'Гудаута', time: '45 мин', price: '1500 ₽' },
    { from: 'Пицунда', to: 'Рица', time: '2 ч', price: '4500 ₽' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Car" className="text-accent" size={32} />
              <span className="text-2xl font-bold text-white">Трансфер Абхазии</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('home')} className="text-white/90 hover:text-accent transition-colors">
                Главная
              </button>
              <button onClick={() => scrollToSection('booking')} className="text-white/90 hover:text-accent transition-colors">
                Забронировать
              </button>
              <button onClick={() => scrollToSection('tariffs')} className="text-white/90 hover:text-accent transition-colors">
                Тарифы
              </button>
              <button onClick={() => scrollToSection('fleet')} className="text-white/90 hover:text-accent transition-colors">
                Автопарк
              </button>
              <button onClick={() => scrollToSection('about')} className="text-white/90 hover:text-accent transition-colors">
                О нас
              </button>
              <button onClick={() => scrollToSection('partners')} className="text-white/90 hover:text-accent transition-colors">
                Партнёры
              </button>
              <button onClick={() => scrollToSection('contacts')} className="text-white/90 hover:text-accent transition-colors">
                Контакты
              </button>
              <Button variant="outline" className="bg-accent text-white border-accent hover:bg-accent/90">
                Личный кабинет
              </Button>
            </div>

            <button className="md:hidden text-white">
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-20 min-h-screen flex items-center relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 31, 44, 0.7), rgba(26, 31, 44, 0.8)), url('https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/7e97e9e9-00f4-4906-83b8-93cef0dc8507.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Премиальный трансфер по Абхазии
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Комфортные поездки из аэропорта Сочи и по всей Абхазии. Надёжно, безопасно, с заботой о каждом пассажире.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" onClick={() => scrollToSection('booking')}>
                <Icon name="Calendar" className="mr-2" size={20} />
                Забронировать трансфер
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                <Icon name="Phone" className="mr-2" size={20} />
                +7 (999) 123-45-67
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" className="text-white/60" size={32} />
        </div>
      </section>

      <section id="booking" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Быстрое бронирование</h2>
            <p className="text-lg text-muted-foreground">Заполните форму и мы свяжемся с вами в течение 5 минут</p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Заказать трансфер</CardTitle>
              <CardDescription>Все поля обязательны для заполнения</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input id="name" placeholder="Иван Иванов" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="from">Откуда</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите место отправления" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sochi">Аэропорт Сочи</SelectItem>
                        <SelectItem value="gagra">Гагра</SelectItem>
                        <SelectItem value="pitsunda">Пицунда</SelectItem>
                        <SelectItem value="sukhum">Сухум</SelectItem>
                        <SelectItem value="gudauta">Гудаута</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Куда</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите место прибытия" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gagra">Гагра</SelectItem>
                        <SelectItem value="pitsunda">Пицунда</SelectItem>
                        <SelectItem value="sukhum">Сухум</SelectItem>
                        <SelectItem value="gudauta">Гудаута</SelectItem>
                        <SelectItem value="ritsa">Озеро Рица</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Дата поездки</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Время</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Количество пассажиров</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 пассажир</SelectItem>
                        <SelectItem value="2">2 пассажира</SelectItem>
                        <SelectItem value="3">3 пассажира</SelectItem>
                        <SelectItem value="4">4 пассажира</SelectItem>
                        <SelectItem value="5-7">5-7 пассажиров</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tariff">Тариф</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тариф" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Эконом</SelectItem>
                        <SelectItem value="comfort">Комфорт</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Способ оплаты</Label>
                  <Tabs defaultValue="prepay50" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="prepay50">Предоплата 50%</TabsTrigger>
                      <TabsTrigger value="full">Полная оплата</TabsTrigger>
                    </TabsList>
                    <TabsContent value="prepay50" className="mt-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Оплатите 50% стоимости сейчас, остальное — водителю наличными
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="full" className="mt-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Оплатите полную стоимость онлайн и экономьте 5%
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-white" size="lg">
                  <Icon name="Check" className="mr-2" size={20} />
                  Отправить заявку
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="tariffs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Тарифы</h2>
            <p className="text-lg text-muted-foreground">Выберите подходящий класс обслуживания</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tariffs.map((tariff, index) => (
              <Card key={index} className={`relative overflow-hidden transition-transform hover:scale-105 ${tariff.popular ? 'border-accent border-2 shadow-2xl' : ''}`}>
                {tariff.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-white">Популярный</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={tariff.icon as any} className="text-accent" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{tariff.name}</CardTitle>
                  <CardDescription className="text-base">{tariff.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-accent">от {tariff.price} ₽</span>
                    <span className="text-muted-foreground">/час</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tariff.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={18} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${tariff.popular ? 'bg-accent hover:bg-accent/90 text-white' : ''}`}
                    variant={tariff.popular ? 'default' : 'outline'}
                    onClick={() => scrollToSection('booking')}
                  >
                    Выбрать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Популярные направления</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {routes.map((route, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center text-sm font-medium mb-2">
                          <Icon name="MapPin" className="text-accent mr-2" size={16} />
                          {route.from}
                        </div>
                        <div className="flex items-center text-sm font-medium">
                          <Icon name="MapPin" className="text-accent mr-2" size={16} />
                          {route.to}
                        </div>
                      </div>
                      <Icon name="ArrowRight" className="text-muted-foreground" size={24} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Icon name="Clock" className="mr-1" size={16} />
                        {route.time}
                      </div>
                      <span className="text-lg font-bold text-accent">{route.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="fleet" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Наш автопарк</h2>
            <p className="text-lg text-muted-foreground">Современные и комфортабельные автомобили для любых задач</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-accent text-white">
                    {car.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{car.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <Icon name="Users" className="mr-1" size={18} />
                      <span className="text-sm">{car.seats}</span>
                    </div>
                  </div>
                  <CardDescription className="text-lg font-semibold text-accent">{car.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {car.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Icon name="Check" className="text-accent mr-2 flex-shrink-0" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant="outline"
                    onClick={() => scrollToSection('booking')}
                  >
                    Забронировать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">О нас</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Award" className="text-accent" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">8+</h3>
                  <p className="text-muted-foreground">лет опыта</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" className="text-accent" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">15000+</h3>
                  <p className="text-muted-foreground">довольных клиентов</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Car" className="text-accent" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">25+</h3>
                  <p className="text-muted-foreground">автомобилей в парке</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed mb-4">
                  <strong>Трансфер Абхазии</strong> — это надёжный партнёр для комфортных поездок по всей Абхазии. 
                  Мы работаем с 2015 года и знаем каждый километр дорог региона.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Наша команда состоит из профессиональных водителей с большим опытом работы. 
                  Все автомобили проходят регулярное техническое обслуживание и всегда находятся в идеальном состоянии.
                </p>
                <p className="text-lg leading-relaxed">
                  Мы гарантируем безопасность, пунктуальность и индивидуальный подход к каждому клиенту. 
                  Ваш комфорт — наш приоритет!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="partners" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Партнёрство с отелями</h2>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Сотрудничество для гостиниц и отелей</CardTitle>
                <CardDescription className="text-base">
                  Предлагаем выгодные условия для гостиничного бизнеса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Icon name="Percent" className="text-accent mr-2" size={20} />
                      Специальные условия
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Скидка до 20% на регулярные заказы</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Приоритетное обслуживание ваших гостей</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Фиксированные цены на весь сезон</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Icon name="Gift" className="text-accent mr-2" size={20} />
                      Дополнительные бонусы
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Брендированные материалы для рецепции</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Круглосуточная поддержка менеджера</span>
                      </li>
                      <li className="flex items-start">
                        <Icon name="Check" className="text-accent mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Ежемесячные отчёты и статистика</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-accent/5 rounded-lg">
                  <h4 className="font-semibold mb-2 text-center">Свяжитесь с нами для обсуждения сотрудничества</h4>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                    <Button className="bg-accent hover:bg-accent/90 text-white">
                      <Icon name="Mail" className="mr-2" size={18} />
                      partners@transfer-abkhazia.ru
                    </Button>
                    <Button variant="outline">
                      <Icon name="Phone" className="mr-2" size={18} />
                      +7 (999) 888-77-66
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Рекламные возможности</CardTitle>
                <CardDescription>Разместите вашу рекламу в наших автомобилях</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Предлагаем размещение рекламных материалов в салонах автомобилей премиум-класса. 
                  Ваша реклама увидят тысячи туристов ежемесячно!
                </p>
                <Button variant="outline" className="w-full">
                  Узнать подробнее о рекламе
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Контакты</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Свяжитесь с нами</CardTitle>
                  <CardDescription>Мы всегда на связи 24/7</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Icon name="Phone" className="text-accent mr-3 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Телефон</p>
                      <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                      <p className="text-muted-foreground">+7 (999) 765-43-21</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Icon name="Mail" className="text-accent mr-3 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">info@transfer-abkhazia.ru</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Icon name="MapPin" className="text-accent mr-3 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Офис</p>
                      <p className="text-muted-foreground">г. Гагра, ул. Абазинская, 53</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Icon name="Clock" className="text-accent mr-3 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Режим работы</p>
                      <p className="text-muted-foreground">Круглосуточно, без выходных</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Быстрая связь</CardTitle>
                  <CardDescription>Задайте вопрос или оставьте отзыв</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Имя</Label>
                      <Input id="contact-name" placeholder="Ваше имя" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Телефон</Label>
                      <Input id="contact-phone" type="tel" placeholder="+7 (999) 123-45-67" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Сообщение</Label>
                      <Input id="message" placeholder="Ваш вопрос или комментарий" />
                    </div>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                      Отправить сообщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Car" className="text-accent" size={28} />
                <span className="text-xl font-bold">Трансфер Абхазии</span>
              </div>
              <p className="text-white/70 text-sm">
                Надёжный трансфер по всей Абхазии с 2015 года
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="text-white/70 hover:text-accent transition-colors">Главная</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="text-white/70 hover:text-accent transition-colors">Забронировать</button></li>
                <li><button onClick={() => scrollToSection('tariffs')} className="text-white/70 hover:text-accent transition-colors">Тарифы</button></li>
                <li><button onClick={() => scrollToSection('fleet')} className="text-white/70 hover:text-accent transition-colors">Автопарк</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="text-white/70 hover:text-accent transition-colors">О компании</button></li>
                <li><button onClick={() => scrollToSection('partners')} className="text-white/70 hover:text-accent transition-colors">Партнёрам</button></li>
                <li><button onClick={() => scrollToSection('contacts')} className="text-white/70 hover:text-accent transition-colors">Контакты</button></li>
                <li><a href="#" className="text-white/70 hover:text-accent transition-colors">Личный кабинет</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-white/70">+7 (999) 123-45-67</li>
                <li className="text-white/70">info@transfer-abkhazia.ru</li>
                <li className="text-white/70 mt-4">г. Гагра, ул. Абазинская, 53</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2024 Трансфер Абхазии. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
