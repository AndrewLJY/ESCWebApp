// client/src/setupTests.js
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.alert = jest.fn();
// expect(global.alert).toHaveBeenCalledWith("Please enter a location or a hotel name.");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!globalThis.importMeta) globalThis.importMeta = { env: {} };
globalThis.importMeta.env.VITE_GOOGLE_MAPS_API_KEY = "test-key";
