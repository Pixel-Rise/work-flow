# Toast Xabarlari - Foydalanish Bo'yicha Qo'llanma

Ushbu loyihada toast xabarlari **o'ng taraf pastdan** chiqadi va loyiha temasiga mos keladi.

## Foydalanish

### 1. Hook orqali foydalanish

```tsx
import { useToast } from "@/hooks/use-toast";

const MyComponent = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast.success("Muvaffaqiyat!", "Amal muvaffaqiyatli bajarildi.");
  };

  return <button onClick={handleClick}>Toast Ko'rsatish</button>;
};
```

### 2. To'g'ridan-to'g'ri import

```tsx
import { toast } from "@/hooks/use-toast";

const handleClick = () => {
  toast.error("Xatolik!", "Nimadir noto'g'ri ketdi.");
};
```

## Toast Turlari

### 1. Success Toast
```tsx
toast.success("Muvaffaqiyat!", "Sizning amalingiz muvaffaqiyatli bajarildi.");
```

### 2. Error Toast
```tsx
toast.error("Xatolik!", "So'rovingizda nimadir noto'g'ri ketdi.");
```

### 3. Warning Toast
```tsx
toast.warning("Ogohlantirish!", "Davom etishdan oldin ma'lumotlaringizni tekshiring.");
```

### 4. Info Toast
```tsx
toast.info("Ma'lumot!", "Bu sizga foydali ma'lumot.");
```

### 5. Loading Toast
```tsx
const toastId = toast.loading("Yuklanmoqda...");

// Keyinroq uni yopish uchun
toast.dismiss(toastId);
```

### 6. Promise Toast
```tsx
const myPromise = fetch("/api/data");

toast.promise(myPromise, {
  loading: "Ma'lumotlar yuklanmoqda...",
  success: "Ma'lumotlar muvaffaqiyatli yuklandi!",
  error: "Ma'lumotlarni yuklashda xatolik!"
});
```

### 7. Custom Toast
```tsx
toast.custom(
  <div className="flex items-center gap-2">
    <Icon />
    <span>Maxsus xabar</span>
  </div>
);
```

## Konfiguratsiya

### Default sozlamalar:
- **Position**: `bottom-right` (o'ng taraf pastdan)
- **Duration**: 
  - Success: 4 soniya
  - Error: 5 soniya  
  - Warning: 4 soniya
  - Info: 4 soniya
- **Theme**: Loyiha temasiga avtomatik mos keladi
- **Rich Colors**: Yoqilgan
- **Close Button**: Yoqilgan

### Toast stilizatsiyasi:
- Tema ranglariga mos keladi (light/dark mode)
- Gradient chegaralar har bir toast turi uchun
- Backdrop blur effekti
- Shadow va border

## Misollar

### Login sahifasida:
```tsx
// Login muvaffaqiyatli
toast.success(t("login_success") || "Tizimga muvaffaqiyatli kirdingiz!");

// Login xatoligi
toast.error(t("login_error") || "Login yoki parol noto'g'ri!");
```

### API so'rovlar uchun:
```tsx
const saveData = async () => {
  const promise = fetch("/api/save", {
    method: "POST",
    body: JSON.stringify(data)
  });

  toast.promise(promise, {
    loading: "Saqlash...",
    success: "Ma'lumotlar saqlandi!",
    error: "Saqlashda xatolik!"
  });
};
```

### Form validation uchun:
```tsx
const validateForm = () => {
  if (!email) {
    toast.warning("Ogohlantirish!", "Email manzilini kiriting.");
    return false;
  }
  
  if (!isValidEmail(email)) {
    toast.error("Xatolik!", "Email manzili noto'g'ri formatda.");
    return false;
  }
  
  return true;
};
```

## Accessibility

- Screen reader lar uchun optimallashtirilgan
- Keyboard navigation qo'llab-quvvatlanadi
- High contrast rejimlarda ham yaxshi ko'rinadi
- ARIA labels va roles mavjud

## Performance

- Lazy loading
- Minimal bundle size
- Efficient re-renders
- Memory leaks yo'q

Bu toast tizimi loyiha bo'ylab izchil va professional foydalanuvchi tajribasini ta'minlaydi.
