import{ create }from "zustand";

const useIde = create((set) => ({
    theme: 0, //def is ligh
    qid:0,
    qs: [],
    langid:null,
    langdriver:null,
    pid:null,
    opid:null,
    pic:null,
    oppic:null,
    pname:null,
    opname:null,
    myqs:0,
    opqs:0,
    code:"",
    compmsg:null,
    comperr:null,
    compout:null,
    setqs: (qs) => (set(() => ({qs: qs}))),
    settheme: (theme) => (set(() => ({theme: theme}))),
    setqid: (qid) => (set(() => ({qid: qid}))),
    setlangid: (langid) => (set(() => ({langid: langid}))), 
    setlangdriver: (langdriver) => (set(() => ({langdriver: langdriver}))),
    setcode: (code) => (set(() => ({code: code}))),
    setcompmsg: (compmsg) => (set(() => ({compmsg: compmsg}))),
    setcomperr: (comperr) => (set(() => ({comperr: comperr}))), 
    setcompout: (compout) => (set(() => ({compout: compout}))),
    setpid: (qs) => (set(() => ({pid: qs}))),
    setopid : (qs) => (set(() => ({opid: qs}))),
    setpic: (qs) => (set(() => ({ppic: qs}))),
    setpname: (qs) => (set(() => ({pname: qs}))),
    setopname: (qs) => (set(() => ({opname: qs}))),
    setoppic: (qs) => (set(() => ({oppic: qs}))),
    incmyqs: () => set((state) => ({ myqs: state.myqs + 1 })),
    incopqs: () => set((state) => ({ opqs: state.opqs + 1 })),
    
}))

export default useIde;