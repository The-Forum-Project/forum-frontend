import React from "react";

export default function FileSelection({ label, selectedFiles, onChange, onDelete, deleteDisable }) {
  return (
    <>
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
          <label htmlFor="file">{label}:</label>
          <input style={{ marginLeft: "10px" }} type="file" id="file" onChange={onChange} multiple />
        </div>
        <div>
              <ul>
                  {selectedFiles.map((file, index) => (
                      <li key={index}>
                          {file.name}
                          {/* TODO: delete button */}
                          {!deleteDisable && (
                                <button type="button" onClick={() => onDelete(index)}>Delete</button>
                            )}
                      </li>
                  ))}
              </ul>
        </div>
    </>
  );
}
