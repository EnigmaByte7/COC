import { create } from "zustand";
import { io } from "socket.io-client";
import { persist ,createJSONStorage} from "zustand/middleware";

const initialSocketState = {
    mid: null,
    opponentId: null,
    opponentName: null,
    opponentImage: null,
};

const useSocket = create(persist((set, get) => ({
    socket: null,
    id: null,
    ...initialSocketState,
    user: {},

    setuser: (user) => set({ user: user }),
    init: () => {
        const { user } = get();
        console.log('inside init ', user);
        if(!user) return;

        const socket = io("http://localhost:4000", {
            auth: {
                token: user?.docId,
                name: user?.name,
                image: user?.image
            },
            transports: ['websocket']
        });

        socket.on("connect", () => {
            set({ id: socket.id });
        });

        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        })

        set({ socket });
    },

    del: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, id: null });
        }
    },

    setmatch: (mid, oid, name, image) => set({ 
        mid: mid, 
        opponentId: oid, 
        opponentName: name, 
        opponentImage: image 
    }),

    setid: (id) => set({ id: id }),

    delmatch: () => set({ 
        mid: null, 
        opponentId: null, 
        opponentName: null, 
        opponentImage: null 
    }),
    resetSocket: () => set(initialSocketState),
}),
    {
        name: "socket",
        partialize: (state) => ({
            mid: state.mid,
            opponentId: state.opponentId,
            opponentName: state.opponentName,
            opponentImage: state.opponentImage,
            user: state.user
        }),
        storage: createJSONStorage(() => sessionStorage)
    }
));

export default useSocket;