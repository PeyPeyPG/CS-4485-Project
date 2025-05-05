import { useEffect, useState } from 'react';

const useDrugInteractions = (username, currentDrugs, candidateDrug = '') => {
    const [warnings, setWarnings] = useState([]);

    useEffect(() => {
        if (!username) return;

        const url = candidateDrug
            ? `/api/medications/interactions/${username}/check/${encodeURIComponent(candidateDrug)}`
            : `/api/medications/interactions/${username}`;

        fetch(url)
            .then(r => r.ok ? r.json() : Promise.resolve([]))
            .then(setWarnings)
            .catch(() => setWarnings([]));
    }, [username, currentDrugs, candidateDrug]);

    return warnings;          // [{ MedicationA, MedicationB }, …]
};

export default useDrugInteractions;