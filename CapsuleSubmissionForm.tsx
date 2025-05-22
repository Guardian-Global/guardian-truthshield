import React, { useRef, useState } from "react";

// Utility to convert file to preview
const getPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      resolve(URL.createObjectURL(file));
    } else if (file.type.startsWith("video/")) {
      resolve(URL.createObjectURL(file));
    } else if (
      file.type === "application/pdf" ||
      file.type.startsWith("text/")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      resolve("");
    }
  });
};

const CapsuleSubmissionForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(await getPreviewUrl(droppedFile));
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(await getPreviewUrl(selectedFile));
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate async submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  // Terminal command prompt style classes
  const terminalBase =
    "bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-6 text-zinc-100 font-mono";
  const terminalInput =
    "bg-zinc-800 border border-zinc-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-lime-400 transition-all text-zinc-100 mt-1 w-full";
  const labelClass = "block text-lime-400 tracking-wider font-semibold mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className={`${terminalBase} max-w-lg mx-auto mt-16 space-y-6`}
      style={{ fontSize: "1rem" }}
    >
      <h2 className="text-lime-400 text-xl mb-2 select-none">
        $ submit-capsule
      </h2>

      {/* Drag-and-drop zone */}
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md transition
          ${file ? "border-lime-500" : "border-zinc-600"}
          hover:border-lime-400 p-6 cursor-pointer bg-zinc-800`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleZoneClick}
        tabIndex={0}
        aria-label="File upload dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*,application/pdf,text/plain,.txt"
          onChange={handleFileChange}
        />
        {!file ? (
          <span className="text-zinc-400 select-none">
            Drag & drop file here, or <span className="text-lime-400">click</span> to select
            <br />
            <span className="text-xs text-zinc-500">
              (Image, Video, PDF, .txt)
            </span>
          </span>
        ) : (
          <span className="text-lime-300 truncate">
            {file.name}
          </span>
        )}
      </div>

      {/* Metadata fields */}
      <div>
        <label className={labelClass}>Title</label>
        <input
          className={terminalInput}
          type="text"
          required
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={terminalInput}
          rows={3}
          required
          placeholder="Describe your capsule..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>Tags</label>
        <input
          className={terminalInput}
          type="text"
          placeholder="Comma-separated tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Toggle switch */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-zinc-400">Anonymous</span>
        <button
          type="button"
          className={`w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${
            anonymous ? "bg-lime-400" : "bg-zinc-700"
          }`}
          onClick={() => setAnonymous((a) => !a)}
          aria-pressed={anonymous}
        >
          <span
            className={`inline-block w-5 h-5 transform rounded-full bg-zinc-900 shadow transition-transform duration-200 ${
              anonymous ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-zinc-400">Named</span>
      </div>

      {/* Preview window */}
      {file && (
        <div
          className="mt-4 bg-zinc-950 border border-zinc-800 rounded p-3"
          style={{ minHeight: 100 }}
        >
          <div className="mb-2 text-zinc-500 text-xs">
            Preview:
          </div>
          {file.type.startsWith("image/") && previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="max-w-full max-h-60 rounded shadow"
            />
          )}
          {file.type.startsWith("video/") && previewUrl && (
            <video
              src={previewUrl}
              controls
              className="max-w-full max-h-60 rounded shadow"
            />
          )}
          {file.type === "application/pdf" && previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-40 rounded"
              title="PDF Preview"
            />
          )}
          {file.type.startsWith("text/") && (
            <div className="bg-zinc-900 rounded p-2 overflow-x-auto whitespace-pre-wrap text-xs text-zinc-200">
              {/* Text preview */}
              <TextFilePreview file={file} />
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          className={`flex-1 py-2 rounded bg-lime-400 text-zinc-900 font-bold tracking-wide shadow
            hover:bg-lime-300 transition disabled:opacity-40
            ${loading ? "cursor-wait" : ""}
          `}
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 01-8 8z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "$ submit"
          )}
        </button>
        {success && (
          <span className="text-lime-400 font-semibold animate-pulse">
            ✓ Capsule sent!
          </span>
        )}
      </div>
    </form>
  );
};

// Helper component for text file preview
const TextFilePreview: React.FC<{ file: File }> = ({ file }) => {
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target?.result as string);
    reader.readAsText(file);
  }, [file]);

  return <pre>{content}</pre>;
};

export default CapsuleSubmissionForm;
