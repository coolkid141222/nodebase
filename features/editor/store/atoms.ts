import type { ReactFlowInstance } from "@xyflow/react";
import { atom, useAtom } from 'jotai';

export const editorAtom = atom<ReactFlowInstance | null>(null)
