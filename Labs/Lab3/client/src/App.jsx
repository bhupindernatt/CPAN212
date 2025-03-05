import "./App.css";
import { useState } from "react";

function App() {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [displayImage, setDisplayImage] = useState(null);
  const [message, setMessage] = useState("");
  const [randomImages, setRandomImages] = useState([]);
  const [dogImage, setDogImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleSingleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSingleFile(e.target.files[0]);
    }
  };

  const handleMultipleFilesChange = (e) => {
    if (e.target.files.length > 3) {
      alert("You can only upload up to 3 files.");
      return;
    }
    setMultipleFiles([...e.target.files]);
  };

  // Fetch a single random image
  const fetchSingleFile = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`http://localhost:8000/fetch/single`);
      if (!response.ok) {
        throw new Error("Failed to fetch single image");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setDisplayImage(imageUrl);
      setMessage("Single image fetched successfully.");
    } catch (error) {
      console.error("Error fetching single file:", error);
      setMessage("Failed to fetch single image.");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload a single file
  const handleSubmitSingleFile = async (e) => {
    e.preventDefault();
    if (!singleFile) {
      setMessage("Please select a file before uploading.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", singleFile);

      const response = await fetch(`http://localhost:8000/save/single`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Image upload failed");
      }

      setMessage("File uploaded successfully!");
      setSingleFile(null); // Reset file input
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to upload file.");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload multiple files
  const handleUploadMultipleFiles = async (e) => {
    e.preventDefault();
    if (multipleFiles.length === 0) {
      setMessage("Please select files before uploading.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      multipleFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`http://localhost:8000/save/multiple`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Image upload failed");
      }

      setMessage("Multiple files uploaded successfully.");
      setMultipleFiles([]); // Reset file input
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      setMessage("Failed to upload multiple files.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch multiple random images
  const fetchMultipleFiles = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`http://localhost:8000/fetch/multiple`);
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setRandomImages(data.images);
      setMessage("Multiple images fetched successfully.");
    } catch (error) {
      console.error("Error fetching multiple files:", error);
      setMessage("Failed to fetch multiple images.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a random dog image
  const fetchDogImages = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`https://dog.ceo/api/breeds/image/random`);
      if (!response.ok) {
        throw new Error("Failed to fetch dog image");
      }
      const data = await response.json();
      setDogImage(data.message);
      setMessage("Dog image fetched successfully.");
    } catch (error) {
      console.error("Failed to fetch dog images:", error);
      setMessage("Failed to fetch dog image.");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload the fetched dog image
  const uploadDogImage = async (e) => {
    e.preventDefault();
    if (!dogImage) {
      setMessage("Click on 'Fetch Dog Image' first!");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(dogImage);
      if (!response.ok) {
        throw new Error("Failed to fetch dog image for upload");
      }
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "dog-image.jpg");

      const uploadResponse = await fetch(`http://localhost:8000/save/dog`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.message || "Failed to save image");
      }

      setMessage("Dog image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading dog image:", error);
      setMessage("Failed to upload dog image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Image Fetcher and Uploader</h1>
      {isLoading && <p>Loading...</p>}
      <p style={{ color: "green" }}>{message}</p>

      {/* Fetch Single Random Image */}
      <section>
        <h2>Fetch Single Random Image</h2>
        <button onClick={fetchSingleFile} disabled={isLoading}>
          Fetch Single File
        </button>
        {displayImage && (
          <div>
            <h3>Single File</h3>
            <img
              src={displayImage}
              alt="Display Image"
              style={{ width: "200px", marginTop: "10px" }}
            />
          </div>
        )}
      </section>

      {/* Fetch Multiple Random Images */}
      <section>
        <h2>Fetch Multiple Random Images</h2>
        <button onClick={fetchMultipleFiles} disabled={isLoading}>
          Fetch Multiple Files
        </button>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {randomImages.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:8000/${img}`}
              alt={`Random ${index}`}
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ))}
        </div>
      </section>

      {/* Upload Single File */}
      <section>
        <h2>Upload Single File</h2>
        <form onSubmit={handleSubmitSingleFile}>
          <input type="file" onChange={handleSingleFileChange} disabled={isLoading} />
          <button type="submit" disabled={isLoading}>
            Upload Single File
          </button>
        </form>
      </section>

      {/* Upload Multiple Files */}
      <section>
        <h2>Upload Multiple Files</h2>
        <form onSubmit={handleUploadMultipleFiles}>
          <input
            type="file"
            multiple
            onChange={handleMultipleFilesChange}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            Upload Multiple Files
          </button>
        </form>
      </section>

      {/* Fetch and Upload Dog Image */}
      <section>
        <h2>Fetch and Upload Dog Image</h2>
        <form onSubmit={fetchDogImages}>
          <button type="submit" disabled={isLoading}>
            Fetch Dog Image
          </button>
        </form>
        {dogImage && (
          <img
            src={dogImage}
            alt="Random Dog"
            style={{ width: "150px", height: "150px", objectFit: "cover", marginTop: "10px" }}
          />
        )}
        <form onSubmit={uploadDogImage} style={{ marginTop: "10px" }}>
          <button type="submit" disabled={isLoading}>
            Upload Dog Image
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;