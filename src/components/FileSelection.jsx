import React from "react";
const buttonStyles = {
    margin: "5px",
    padding: "10px 15px",
    fontWeight: "bold",
    borderRadius: "4px",
    backgroundColor: "#1976d2", // Darker blue background color
    color: "white", // White text color
    border: "none", // No border
    cursor: "pointer", // Show pointer cursor on hover
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Add a subtle box shadow
};

export default function FileSelection({ label, selectedFiles, onChange, onDelete, deleteDisable }) {
  return (
    <>
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
          <label htmlFor="file">{label}:</label>
          <input type="file" id="file" onChange={onChange} multiple />
        </div>
        <div>
              <ul>
                  {selectedFiles.map((file, index) => (
                      <li key={index}>
                          {file.name}
                          {/* TODO: delete button */}
                          {!deleteDisable && (
                                <button style={buttonStyles} type="button" onClick={() => onDelete(index)}>Delete</button>
                            )}
                      </li>
                  ))}
              </ul>
        </div>
    </>
  );
}