import React from 'react';
// import logo from './logo.svg';
import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import './App.css';

//const { Rembg } = require("rembg-node");
import imglyRemoveBackground, {Config} from "@imgly/background-removal"
//import CustomWebCam from "./CustomWebCam"; // import it

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
  //facingMode: { exact: "environment" },
};
const App = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);

  const public_path = `${window.location.href}assets/model/`;

  let config: Config =  {
    debug: true,
    publicPath: public_path, // path to the wasm files
    model: "small",
  };

  // async function load() {
  //   const imageBlob = await imglyRemoveBackground(imageSrc, {
  //     publicPath: public_path,
  //     // debug: true,
  //     progress: (key :any, current :any, total :any) => {
  //       const [type, subtype] = key.split(':');
  //       console.log(`[${type}] ${subtype} ${current}/${total}`);
  //     }
  //   });

  //   const url = URL.createObjectURL(imageBlob);

  //   setUrl(url);
  // }

  function _convertToFile (imgData: string, file: { name: string; type: any; }) {
    // ここでバイナリにしている
    const blob = atob(imgData.replace(/^.*,/, ''));
    let buffer = new Uint8Array(blob.length);
    for (let i = 0; i < blob.length; i++) {
	buffer[i] = blob.charCodeAt(i);
    }
    return new File([buffer.buffer], file.name, {type: file.type});
}

  const capture = useCallback(async() => {

    let imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      const file = _convertToFile(imageSrc, {name: "test.jpg", type: "image/jpeg"});
      const imageBlob = await imglyRemoveBackground(file, {
        publicPath: public_path,
        debug: true,
        progress: (key :any, current :any, total :any) => {
          const [type, subtype] = key.split(':');
          console.log(`[${type}] ${subtype} ${current}/${total}`);
       }
      });
      console.log('Image loaded');
      setUrl(URL.createObjectURL(imageBlob));
    }
  }, [webcamRef]);

  return (
    <>
      <header>
        <h1>カメラアプリ</h1>
      </header>
      {isCaptureEnable || (
        <button onClick={() => setCaptureEnable(true)}>開始</button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button onClick={() => setCaptureEnable(false)}>終了</button>
          </div>
          <div>
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <button onClick={() => {
                capture();
              }}>撮影</button>
        </>
      )}
      {url && (
        <>
          <div>
            <button
              onClick={() => {
                setUrl(null);
              }}
            >
              削除
            </button>
          </div>
          <div>
            <img src={url} alt="Screenshot" />
          </div>
        </>
      )}
    </>
  );
};

export default App;