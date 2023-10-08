import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react"; // import useCallback

const CustomWebCam = () => {
    const retake = () => {
        setImgSrc(undefined);
        };
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string>();
  const [mirrored, setMirrored] = useState(false);

  // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc){
        return;
    }
    setImgSrc(imageSrc);
  }, [webcamRef]);

  return (
    // rest of the code
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600}
        width={600}
        ref={webcamRef}
        mirrored={mirrored}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.8}
        />
      )}
      <div className="controls">
        <div>
          <input
            type="checkbox"
            checked={mirrored}
            onChange={(e) => setMirrored(e.target.checked)}
          />
          <label>Mirror</label>
        </div>
      </div>
      <div className="btn-container">
        {imgSrc ? (
          <button onClick={retake}>Retake photo</button>
        ) : (
          <button onClick={capture}>Capture photo</button>
        )}
      </div>
    </div>
  );
};

export default CustomWebCam;