import { useState, useEffect } from 'react';
import { lectures as seedLectures } from '../data/lectures';

const STORAGE_KEY = 'mind_univ_lectures_v1';

export function useLectures() {
    const [lectures, setLectures] = useState([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setLectures(JSON.parse(saved));
        } else {
            // Initialize with seed data
            setLectures(seedLectures);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seedLectures));
        }
        setInitialized(true);
    }, []);

    const saveLectures = (newLectures) => {
        setLectures(newLectures);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLectures));
    };

    const addLecture = (floorId, title) => {
        const newLecture = {
            id: `L-${Date.now()}`,
            floorId,
            title,
            workshops: []
        };
        saveLectures([...lectures, newLecture]);
    };

    const addWorkshop = (lectureId, workshop) => {
        const newLectures = lectures.map(l => {
            if (l.id === lectureId) {
                return {
                    ...l,
                    workshops: [...l.workshops, { ...workshop, id: `W-${Date.now()}` }]
                };
            }
            return l;
        });
        saveLectures(newLectures);
    };

    const updateWorkshop = (lectureId, updatedWorkshop) => {
        const newLectures = lectures.map(l => {
            if (l.id === lectureId) {
                return {
                    ...l,
                    workshops: l.workshops.map(w => w.id === updatedWorkshop.id ? updatedWorkshop : w)
                };
            }
            return l;
        });
        saveLectures(newLectures);
    };

    const deleteWorkshop = (lectureId, workshopId) => {
        const newLectures = lectures.map(l => {
            if (l.id === lectureId) {
                return {
                    ...l,
                    workshops: l.workshops.filter(w => w.id !== workshopId)
                };
            }
            return l;
        });
        saveLectures(newLectures);
    };

    return {
        lectures,
        addLecture,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        initialized
    };
}
