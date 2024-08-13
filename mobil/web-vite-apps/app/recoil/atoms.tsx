// recoil/atoms.ts
import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: "ssss",
});

export const baseUrlAtom = atom({
  key: "baseUrlAtom",
  default: "",
});
