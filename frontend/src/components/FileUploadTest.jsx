import { useState } from "react";
import axios from "axios";

function FileUploadTest() {
  const [file, setFile] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:5000/user/upload-file/resume", formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXZhbXBhcnZhdGU2MUBnbWFpbC5jb20iLCJpYXQiOjE3NjIzMzY3NDQsImV4cCI6MTc2MjQyMzE0NH0.mE3UKwJl7tbzdVjRXHNKF4AaObHd0M7BJcczubWFN_g"
        },
      });

    console.log(response.data);
    alert(response.data.message);
  };

  return (
    <div>
      <h2>Test File Upload</h2>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUploadTest;
