import { create } from 'zustand';

const useAcademicFlowStore = create((set) => ({
  campusShift: null,
  classItem: null,
  subjectItem: null,
  sectionItem: null,

  systemTypeList:null,

  setCampusShift: (data) => set({ campusShift: data }),
  setClassItem: (data) => set({ classItem: data }),
  setSubjectItem: (data) => set({ subjectItem: data }),
  setSectionItem: (data) => set({ sectionItem: data }),
  setSystemTypeList: (data) => set({ systemTypeList: data }),

  resetFlow: () =>
    set({
      campusShift: null,
      classItem: null,
      subjectItem: null,
      sectionItem: null,
      systemTypeList:null
    }),
}));

export default useAcademicFlowStore;