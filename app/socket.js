import { create } from "zustand";
import { io } from "socket.io-client";

const useSocket = create((set) => ({
    socket: null,
    id:null,
    mid:null,
    init: () => set(() => ( {socket: io("http://localhost:9000")})),
    del: () => set((state) => {
        state.socket?.disconnect();
        return { socket: null };
     }),
    setmatch: (mid) => set(() => ({mid: mid})),
    setid:(id) => set(() => ({id : id}))
}))

export default useSocket;