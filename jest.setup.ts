import "@testing-library/jest-dom";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})), // 模擬 getAuth
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));
