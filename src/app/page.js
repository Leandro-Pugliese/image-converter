'use client'
import { useState } from "react";
import axios from '@/app/utils/axios'
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [changeFile, setChangeFile] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [format, setFormat] = useState("jpeg");
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //manejo el cambio en el input de la imagen
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setChangeFile("Cambiar Imagen");
      setSelectedFileName(file.name);
    }
  };
  //manejo el cambio en el input del formato
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  //manejo el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      return alert("Por favor, selecciona una imagen.");
    }
    const formData = new FormData();
    formData.append("imagen", image);
    formData.append("format", format);

    try {
      setLoading(true);
      setError('');
      const config = {
        method: "post",
        url: `/convertir`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },
        responseType: "arraybuffer", //Para recibir la imagen en formato binario
      };
      const response = await axios(config);
      const blob = new Blob([response.data], {type: `image/${format}`});
      const imageUrl = URL.createObjectURL(blob);
      setConvertedImage(imageUrl);
      setLoading(false);
    } catch (err) {
      setError("Error al convertir la imagen");
      setLoading(false);
    }
  };

  //Descargar la imagen convertida
  const handleDownload = () => {
    if (convertedImage) {
      const a = document.createElement("a");
      a.href = convertedImage;
      a.download = `${selectedFileName}-converted.${format}`;
      a.click();
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center flex-col text-white">
      <h1 className="mt-4">Conversor de Imágenes</h1>
      <form onSubmit={handleSubmit} className="pt-8 w-full text-center mb-4">
        <div className="flex flex-col items-center">
          <label 
            htmlFor="image"
            className="cursor-pointer bg-pink-800 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          >
            {changeFile || 'Seleccionar Imagen'}
          </label>
          <input 
            type="file" 
            id="image" 
            onChange={handleImageChange} 
            className="hidden"
          />
        </div>
        {
          (selectedFileName) &&
          <div className='mt-2'>
            <p className='ml-2'>{selectedFileName}</p>
          </div>
        }
        <div className="mt-6">
          <label htmlFor="format" className="mr-4">Formato de destino:</label>
          <select id="format" value={format} onChange={handleFormatChange} className="bg-pink-800 outline-none cursor-pointer rounded">
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
            <option value="gif">GIF</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-violet-800 text-white py-2 px-4 w-72 rounded cursor-pointer hover:bg-violet-700 mt-4">
          {loading ? "Convirtiendo..." : "Convertir Imagen"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {convertedImage && (
        <div>
          <h2>Imagen Convertida:</h2>
          <img src={convertedImage} alt="Imagen Convertida" />
          <button 
            className="bg-violet-800 text-white py-2 px-4 w-full rounded cursor-pointer hover:bg-violet-700 mt-2 mb-4" 
            onClick={handleDownload}
          >
            Descargar imagen
            <i className="bi bi-download mx-2"/>
          </button>
        </div>
      )}
    </div>
  );
}

