# 🎨 MakeMyQR - Custom QR Code Generator

**MakeMyQR** is a highly customizable QR code generator built using **React + Vite**. It allows users to create stylish and branded QR codes with gradients, logos, and various styling options.
- Live link: https://make-my-qr-git-main-evita-barbozas-projects.vercel.app/

## 🚀 Features

- 🔗 **Link-to-QR**: Generate a QR code for any URL.
- 🎨 **Gradient Colors**: Pick custom start and end colors for beautiful gradients.
- 🧱 **QR Styles**: Choose from various dot and square styles.
- 📐 **Custom Sizes**: Adjust the size of the QR code to your needs.
- 🖼️ **Logo Support**:
  - Upload a logo image.
  - Customize logo size (0–100).
  - Change logo border radius for square or circle appearance.
- 💾 **Download Options**: Export your QR code as **PNG**, **JPG**, or **SVG**.
- ⚙️ **Live Preview**: See changes applied instantly as you customize.



## 🛠️ Tech Stack

- ⚛️ React (with Hooks)
- ⚡ Vite (for fast development)
- 🎨 Bootstrap 5
- 🧩 [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) library



## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/evitabarboza/MakeMyQR.git
cd MakeMyQR
npm install
````



## 🧪 Running Locally

To run the app locally:

```bash
npm run dev
```

Open your browser and navigate to:
[http://localhost:5173](http://localhost:5173)


## 🖼️ Folder Structure

```
src/
├── components/
│   └── QRGenerator.jsx      # Main QR Code generation logic
├── assets/                  # Logo placeholders and icons
├── App.jsx
├── main.jsx
public/
├── index.html
```



## 📥 Download Options

Users can export QR codes as:

* `.png` (default)
* `.jpg`
* `.svg`

## ✅ Future Improvements

* 🔄 QR code scanning preview
* 🌙 Dark mode support
* 📁 Preset saving (user preferences)
* 🖱️ Drag & drop logo upload
* 🧪 QR validation / error correction levels



## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.


## 📄 License

MIT © 2025 \[Evita Sharon Barboza]


## 💡 Credits

Thanks to:

* [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
* [Bootstrap](https://getbootstrap.com)
* [Vite](https://vitejs.dev)
