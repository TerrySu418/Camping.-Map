// app/test-error/page.tsx
"use client";

import { useState } from "react";
import { testErrorAction } from "@/lib/actions/test/test-error";

const TestPino = () => {
  const [result, setResult] = useState<unknown>(null);

  const handleTest = async () => {
    const response = await testErrorAction();
    setResult(response);
  };

  return (
    <>
      <h1>Testing Error Classes</h1>
      <button
        type="button"
        onClick={handleTest}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Test Server Action
      </button>

      {result && (
        <pre className="mt-4 rounded bg-gray-100 p-4">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </>
  );
};

export default TestPino;
