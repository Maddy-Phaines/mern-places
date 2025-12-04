import Button from "./Button";
import "./ImageUpload.css";

import { useRef, useState, useEffect } from "react";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef();
  const handlePickImage = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    console.log("Event target is:", event.target);
    console.log(
      "files:",
      event.target.files,
      "files.length:",
      event.target.files?.length
    );
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      console.log("pickedFile (before setFile):", pickedFile);
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
      console.log("Is valid is:", isValid);
    }
    props.onInput(props.id, pickedFile, fileIsValid);
    console.log("fileIsValid:", fileIsValid);
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center} && center`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={handlePickImage}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
