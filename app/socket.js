import { create } from "zustand";
import { io } from "socket.io-client";

const useSocket = create((set) => ({
    socket: null,
    id:null,
    mid:null,
    opponentId:null, //docid
    opponentName:null,
    opponentImage:null,
    init: () => set(() => {
        const socket =  io("http://localhost:8080")
        console.log('socket from zustand...', socket);
        
        return {socket, id: socket.id} }),
    del: () => set((state) => {
        state.socket?.disconnect();
        return { socket: null };
     }),
    setmatch: (mid, oid, name, image) => set(() => ({mid: mid, opponentId: oid, opponentName: name, opponentImage: image})),
    setid:(id) => set(() => ({id : id})),
    delmatch : () => set(() => ({mid: null, oid:null})),
}))

export default useSocket;