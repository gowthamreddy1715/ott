import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./FileUpload.module.css";
import RealmLogo from "./RealmLogo";

const FileUpload = () => {
  const [zipFile, setZipFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAgeRating, setSelectedAgeRating] = useState("");
  const [genres, setGenres] = useState([]);
  const imageInputRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8800/genres")
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleZipChange = (e) => {
    setZipFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (
      !title ||
      !description ||
      !scheduledTime ||
      !selectedGenre ||
      !selectedCategory ||
      !selectedAgeRating ||
      !zipFile ||
      !imageFile
    ) {
      setUploadMessage("Please fill in all the details before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("zip", zipFile);
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("scheduledTime", scheduledTime);
    formData.append("genre", selectedGenre);
    formData.append("categories", selectedCategory);
    formData.append("ageRating", selectedAgeRating);

    axios
      .post("http://localhost:8800/upload", formData)
      .then((response) => {
        console.log(response.data);
        setUploadMessage("Files uploaded and data saved successfully.");
        setTimeout(() => {
          setUploadMessage("");
        }, 5000);

        setZipFile(null);
        setImageFile(null);
        setTitle("");
        setDescription("");
        setScheduledTime("");
        setSelectedGenre("");
        setSelectedCategory("");
        setSelectedAgeRating("");
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      })
      .catch((error) => {
        console.error(error);
        setUploadMessage(
          "Error uploading files and saving data. Please try again."
        );
      });
  };

  return (
    <div>
      <RealmLogo />
      <div className={styles.fileuploadcontainer}>
        <h2 className={styles.movieh}>Movie Upload</h2>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="titleInput">
            Title
          </label>
          <input
            type="text"
            id="titleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="descriptionInput">
            Description
          </label>
          <textarea
            id="descriptionInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="scheduledTimeInput">
            Scheduled Time
          </label>
          <input
            type="datetime-local"
            id="scheduledTimeInput"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="genreInput">
            Genre
          </label>
          <select
            className={styles.selup}
            id="genreInput"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.genre}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="categoriesInput">
            Categories
          </label>
          <select
            className={styles.selup}
            id="categoriesInput"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Movies">Movies</option>
            <option value="Shows">Shows</option>
          </select>
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="ageRatingInput">
            Age Rating
          </label>
          <select
            className={styles.selup}
            id="ageRatingInput"
            value={selectedAgeRating}
            onChange={(e) => setSelectedAgeRating(e.target.value)}
          >
            <option value="">Select Age Rating</option>
            <option value="13+">13+</option>
            <option value="18+">18+</option>
          </select>
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="zipInput">
            Choose Zip File (containing .m3u8 and .ts files)
          </label>
          <input
            type="file"
            accept=".zip"
            onChange={handleZipChange}
            id="zipInput"
          />
        </div>
        <div className={styles.fileinputcontainer}>
          <label className={styles.labup} htmlFor="imageInput">
            Choose Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
          />
        </div>
        <button onClick={handleUpload} className={styles.upload}>
          Upload
        </button>
        {uploadMessage && <p className={styles.uppcl}>{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default FileUpload;