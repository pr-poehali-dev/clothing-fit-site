import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Icon from '@/components/ui/icon'

interface ClothingItem {
  id: string
  name: string
  price: string
  image: string
  sizes: string[]
  colors: string[]
  category: string
}

const clothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Голубое платье принцессы',
    price: '4 990 ₽',
    image: '/img/94a41dd4-6120-4e09-938b-0db2c1dacd53.jpg',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Голубой', 'Розовый', 'Белый'],
    category: 'Платья'
  },
  {
    id: '2', 
    name: 'Джинсовая куртка',
    price: '3 490 ₽',
    image: '/img/b2e538f4-8932-4c59-911b-e206a41a1eb5.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Синий', 'Черный', 'Белый'],
    category: 'Куртки'
  },
  {
    id: '3',
    name: 'Розовый топ',
    price: '2 290 ₽', 
    image: '/img/b2e538f4-8932-4c59-911b-e206a41a1eb5.jpg',
    sizes: ['XS', 'S', 'M'],
    colors: ['Розовый', 'Белый', 'Бежевый'],
    category: 'Топы'
  }
]

export default function Index() {
  const [isARMode, setIsARMode] = useState(false)
  const [isPhotoMode, setIsPhotoMode] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isARMode && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(err => console.error('Ошибка доступа к камере:', err))
    }
  }, [isARMode])

  const startARTryOn = (item: ClothingItem) => {
    setSelectedItem(item)
    setSelectedSize(item.sizes[0])
    setSelectedColor(item.colors[0])
    setShowPhotoOptions(true)
  }

  const startLiveAR = () => {
    setIsARMode(true)
    setShowPhotoOptions(false)
  }

  const startPhotoAR = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string)
        setIsPhotoMode(true)
        setShowPhotoOptions(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleCameraFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string)
        setIsPhotoMode(true)
        setShowPhotoOptions(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const stopARMode = () => {
    setIsARMode(false)
    setIsPhotoMode(false)
    setSelectedItem(null)
    setUploadedPhoto(null)
    setShowPhotoOptions(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      {/* Заголовок */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              JEUNE ÂME
            </h1>
            <div className="flex items-center gap-4">
              <Icon name="Heart" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Icon name="ShoppingBag" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Icon name="Menu" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Выбор режима примерки */}
      {showPhotoOptions && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Выберите способ примерки
              </h3>
              <p className="text-muted-foreground text-sm">Как хотите примерить {selectedItem.name}?</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={startLiveAR} 
                className="w-full h-12 justify-start"
                variant="outline"
              >
                <Icon name="Video" size={20} className="mr-3 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Включить камеру</p>
                  <p className="text-xs text-muted-foreground">Примерка в реальном времени</p>
                </div>
              </Button>
              
              <Button 
                onClick={startPhotoAR} 
                className="w-full h-12 justify-start"
                variant="outline"
              >
                <Icon name="Image" size={20} className="mr-3 text-accent" />
                <div className="text-left">
                  <p className="font-semibold">Выбрать фото</p>
                  <p className="text-xs text-muted-foreground">Загрузить из галереи</p>
                </div>
              </Button>
              
              <Button 
                onClick={handleCameraCapture} 
                className="w-full h-12 justify-start"
                variant="outline"
              >
                <Icon name="Camera" size={20} className="mr-3 text-secondary" />
                <div className="text-left">
                  <p className="font-semibold">Сделать фото</p>
                  <p className="text-xs text-muted-foreground">Сфотографировать сейчас</p>
                </div>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setShowPhotoOptions(false)}
              className="w-full mt-4"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      {/* Скрытые input элементы */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleCameraFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* AR Примерочная - Живая камера */}
      {isARMode && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Виртуальная примерка UI */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-80 border-2 border-primary/50 rounded-lg bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="Shirt" size={48} className="mx-auto mb-2 opacity-60" />
                    <p className="text-sm opacity-80">Примерка {selectedItem.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Панель управления */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-4 mb-3">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{selectedItem.name}</h3>
                    <p className="text-primary font-bold">{selectedItem.price}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Размер</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.sizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Цвет</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.colors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 h-9" size="sm">
                    <Icon name="ShoppingCart" size={16} className="mr-1" />
                    В корзину
                  </Button>
                  <Button variant="outline" size="sm" onClick={stopARMode} className="h-9">
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AR Примерочная - Фото режим */}
      {isPhotoMode && selectedItem && uploadedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            <img
              src={uploadedPhoto}
              alt="Загруженное фото"
              className="w-full h-full object-cover"
            />
            
            {/* Виртуальная примерка на фото */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-64 border-2 border-primary/70 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="Shirt" size={40} className="mx-auto mb-2 opacity-80" />
                    <p className="text-xs opacity-90">{selectedItem.name}</p>
                    <p className="text-xs opacity-70">{selectedColor} • {selectedSize}</p>
                  </div>
                </div>
              </div>
              
              {/* Индикатор AR */}
              <div className="absolute top-4 left-4">
                <div className="bg-primary/90 px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-xs font-medium">AR Примерка</span>
                </div>
              </div>
            </div>

            {/* Панель управления для фото режима */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-4 mb-3">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{selectedItem.name}</h3>
                    <p className="text-primary font-bold">{selectedItem.price}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    На фото
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Размер</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.sizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Цвет</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.colors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 h-9" size="sm">
                    <Icon name="ShoppingCart" size={16} className="mr-1" />
                    В корзину
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-9">
                    <Icon name="RefreshCw" size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={stopARMode} className="h-9">
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero секция */}
        <section className="text-center mb-12">
          <div className="relative">
            <img 
              src="https://cdn.poehali.dev/files/2cf3c5bd-31ce-45f9-8c95-9cad6b2f43bf.png"
              alt="Fashion showcase"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  AR Примерочная
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Попробуйте одежду виртуально через камеру телефона
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                  <Icon name="Camera" size={20} className="mr-2" />
                  Начать примерку
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Каталог одежды */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Коллекция
              </h2>
              <p className="text-muted-foreground">Выберите понравившийся образ для примерки</p>
            </div>
            <Badge variant="secondary" className="px-4 py-2">
              <Icon name="Sparkles" size={16} className="mr-2" />
              AR технология
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clothingItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-foreground border border-border/50">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">{item.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Heart" size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
                      {item.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ 
                            backgroundColor: color === 'Голубой' ? '#87CEEB' : 
                                           color === 'Розовый' ? '#FFC0CB' : 
                                           color === 'Белый' ? '#FFFFFF' :
                                           color === 'Синий' ? '#4169E1' :
                                           color === 'Черный' ? '#000000' :
                                           color === 'Бежевый' ? '#F5F5DC' : '#cccccc'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.sizes.join(', ')}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => startARTryOn(item)}
                  >
                    <Icon name="Camera" size={16} className="mr-2" />
                    Примерить в AR
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Информационный блок */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-8 border border-border/50">
            <div className="max-w-2xl mx-auto">
              <Icon name="Smartphone" size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Как работает AR примерка?
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Наведите камеру на себя, выберите понравившуюся вещь и посмотрите, 
                как она будет смотреться на вас. Технология дополненной реальности 
                позволяет примерить одежду без посещения магазина.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Camera" size={24} className="text-primary" />
                  </div>
                  <p className="font-semibold mb-1">Включите камеру</p>
                  <p className="text-sm text-muted-foreground">Разрешите доступ к камере телефона</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Shirt" size={24} className="text-accent" />
                  </div>
                  <p className="font-semibold mb-1">Выберите одежду</p>
                  <p className="text-sm text-muted-foreground">Нажмите "Примерить" на понравившейся вещи</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Eye" size={24} className="text-secondary" />
                  </div>
                  <p className="font-semibold mb-1">Оцените результат</p>
                  <p className="text-sm text-muted-foreground">Посмотрите, как одежда сидит на вас</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Подвал */}
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 JEUNE ÂME. Детская мода с технологией AR
          </p>
        </div>
      </footer>
    </div>
  )
}