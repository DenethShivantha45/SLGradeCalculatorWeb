const StudentType = {
    GRADE_5_SCHOLARSHIP: "Grade 5 Scholarship",
    GRADE_6_TO_9: "Grade 6-9",
    OL_STUDENT: "O/L Student",
    AL_ARTS: "A/L Arts Stream",
    AL_COMMERCE: "A/L Commerce Stream",
    AL_SCIENCE: "A/L Science Stream",
    AL_MATHS: "A/L Maths Stream",
    AL_TECHNOLOGY: "A/L Technology Stream",
};

class Subject {
    constructor(name, marks) {
        this.name = name;
        this.marks = marks;
    }

    getName() {
        return this.name;
    }

    getMarks() {
        return this.marks;
    }

    toString() {
        return `${this.name}: ${this.marks}`;
    }
}

let students = [];

const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section-content');

const studentNameInput = document.getElementById('studentName');
const studentTypeSelect = document.getElementById('studentType');
const addStudentBtn = document.getElementById('addStudentBtn');
const addStudentMessage = document.getElementById('addStudentMessage');

const selectStudentForMarks = document.getElementById('selectStudentForMarks');
const subjectInputsContainer = document.getElementById('subjectInputsContainer');
const compulsorySubjectsInputs = document.getElementById('compulsorySubjectsInputs');
const optionalSubjectsInputs = document.getElementById('optionalSubjectsInputs');
const saveMarksBtn = document.getElementById('saveMarksBtn');
const addMarksMessage = document.getElementById('addMarksMessage');

const selectStudentForReport = document.getElementById('selectStudentForReport');
const viewReportBtn = document.getElementById('viewReportBtn');
const studentReportDisplay = document.getElementById('studentReportDisplay');
const viewReportMessage = document.getElementById('viewReportMessage');

const allStudentsList = document.getElementById('allStudentsList');
const listStudentsMessage = document.getElementById('listStudentsMessage');

const compulsorySubjects = {
    'GRADE_5_SCHOLARSHIP': ['Paper I', 'Paper II'],
    'GRADE_6_TO_9': ['Sinhala/Tamil', 'English', 'Mathematics', 'Science', 'History', 'Religion', 'Health & Physical Education', 'ICT'],
    'OL_STUDENT': ['Religion', 'Sinhala/Tamil', 'English', 'Mathematics', 'Science', 'History'],
    'AL_ARTS': ['Common General Paper', 'General English'],
    'AL_COMMERCE': ['Common General Paper', 'General English'],
    'AL_SCIENCE': ['Common General Paper', 'General English'],
    'AL_MATHS': ['Combined Mathematics', 'Physics', 'Chemistry'],
    'AL_TECHNOLOGY': ['Common General Paper', 'General English', 'Science for Technology']
};

const optionalSubjects = {
    'OL_STUDENT': [
        'Business Studies', 'Accounting', 'Geography', 'Civics', 'Art', 'Music',
        'Dancing', 'Drama & Theatre', 'Home Economics', 'Design & Technology', 'ICT'
    ],
    'AL_ARTS': [
        'History', 'Geography', 'Political Science', 'Logic & Scientific Method',
        'Communication & Media Studies', 'Sinhala Literature', 'English Literature',
        'Economics'
    ],
    'AL_COMMERCE': [
        'Business Studies', 'Accounting', 'Economics'
    ],
    'AL_SCIENCE': [
        'Physics', 'Chemistry', 'Biology'
    ],
    'AL_MATHS': [
        'Combined Mathematics', 'Physics', 'Chemistry'
    ],
    'AL_TECHNOLOGY': [
        'Engineering Technology', 'Bio-systems Technology'
    ]
};

function showMessage(element, msg, type) {
    element.textContent = msg;
    element.className = `message ${type}`;
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.add('hidden');
    }, 3000);
}

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudents() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        students = JSON.parse(storedStudents);
    }
}

function findStudentByName(name) {
    return students.find(s => s.name.toLowerCase() === name.toLowerCase());
}

function calculateTotalMarks(student) {
    return student.subjects.reduce((total, subject) => total + subject.marks, 0);
}

function calculateAveragePercentage(student) {
    if (student.subjects.length === 0) {
        return 0.0;
    }
    return (calculateTotalMarks(student) / (student.subjects.length * 100.0)) * 100;
}

function getLetterGrade(average) {
    if (average >= 90) {
        return "A";
    } else if (average >= 80) {
        return "B";
    } else if (average >= 70) {
        return "C";
    } else if (average >= 60) {
        return "D";
    } else {
        return "F";
    }
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        sections.forEach(section => section.classList.remove('active'));
        const targetId = button.dataset.target;
        document.getElementById(targetId).classList.add('active');

        if (targetId === 'addMarks' || targetId === 'viewReport') {
            populateStudentDropdowns();
        } else if (targetId === 'listStudents') {
            renderAllStudents();
        }
    });
});

addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    const type = studentTypeSelect.value;

    if (!name || !type) {
        showMessage(addStudentMessage, 'Please fill in all fields.', 'error');
        return;
    }
    if (findStudentByName(name)) {
        showMessage(addStudentMessage, 'Student with this name already exists.', 'error');
        return;
    }

    students.push({
        name: name,
        type: type,
        subjects: []
    });
    saveStudents();
    showMessage(addStudentMessage, `Student '${name}' (${StudentType[type]}) added successfully.`, 'success');
    studentNameInput.value = '';
    studentTypeSelect.value = '';
});

function populateStudentDropdowns() {
    selectStudentForMarks.innerHTML = '<option value="">Select a student</option>';
    selectStudentForReport.innerHTML = '<option value="">Select a student</option>';

    if (students.length === 0) {
        const noStudentsOption = document.createElement('option');
        noStudentsOption.value = '';
        noStudentsOption.textContent = 'No students available';
        noStudentsOption.disabled = true;
        selectStudentForMarks.appendChild(noStudentsOption.cloneNode(true));
        selectStudentForReport.appendChild(noStudentsOption);
        return;
    }

    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = `${student.name} (${StudentType[student.type]})`;
        selectStudentForMarks.appendChild(option.cloneNode(true));
        selectStudentForReport.appendChild(option);
    });
}

selectStudentForMarks.addEventListener('change', () => {
    const selectedStudentName = selectStudentForMarks.value;
    const student = findStudentByName(selectedStudentName);

    compulsorySubjectsInputs.innerHTML = '';
    optionalSubjectsInputs.innerHTML = '';
    subjectInputsContainer.classList.add('hidden');

    if (student) {
        subjectInputsContainer.classList.remove('hidden');
        renderSubjectInputs(student);
    }
});

function renderSubjectInputs(student) {
    compulsorySubjectsInputs.innerHTML = '';
    optionalSubjectsInputs.innerHTML = '';

    const type = student.type;

    const compSubjects = compulsorySubjects[type] || [];
    if (compSubjects.length > 0) {
        const h4 = document.createElement('h4');
        h4.className = 'text-md font-medium text-gray-700 mb-2';
        h4.textContent = 'Compulsory Subjects:';
        compulsorySubjectsInputs.appendChild(h4);

        compSubjects.forEach(subjectName => {
            const div = document.createElement('div');
            div.className = 'subject-input-group';
            div.innerHTML = `
                <label for="marks-${subjectName.replace(/\s/g, '-')}" class="block">${subjectName}:</label>
                <input type="number" id="marks-${subjectName.replace(/\s/g, '-')}" class="subject-input"
                       data-subject-name="${subjectName}" placeholder="Enter marks (0-100)" min="0" max="100">
            `;
            compulsorySubjectsInputs.appendChild(div);
        });
    }

    const optSubjects = optionalSubjects[type] || [];
    if (optSubjects.length > 0) {
        const h4 = document.createElement('h4');
        h4.className = 'text-md font-medium text-gray-700 mt-4 mb-2';
        let numOptional = 0;
        if (type === 'OL_STUDENT' || type.startsWith('AL_')) {
            numOptional = 3;
            h4.textContent = `Optional Subjects (Choose ${numOptional}):`;
        } else {
            h4.textContent = 'Optional Subjects:';
        }
        optionalSubjectsInputs.appendChild(h4);

        if (numOptional > 0) {
            const selectedOptional = new Set();
            for (let i = 0; i < numOptional; i++) {
                const div = document.createElement('div');
                div.className = 'subject-input-group';
                div.innerHTML = `
                    <label for="optional-select-${i}" class="block">Optional Subject ${i + 1}:</label>
                    <select id="optional-select-${i}" class="optional-subject-select">
                        <option value="">Select a subject</option>
                        ${optSubjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <input type="number" id="optional-marks-${i}" class="optional-marks-input hidden"
                           placeholder="Marks (0-100)" min="0" max="100">
                `;
                optionalSubjectsInputs.appendChild(div);

                div.querySelector(`#optional-select-${i}`).addEventListener('change', (event) => {
                    const selectedValue = event.target.value;
                    const marksInput = div.querySelector(`#optional-marks-${i}`);

                    const prevSelected = Array.from(selectedOptional).find(item => item.element === event.target);
                    if (prevSelected) {
                        selectedOptional.delete(prevSelected);
                    }

                    if (selectedValue && Array.from(selectedOptional).some(item => item.value === selectedValue)) {
                        showMessage(addMarksMessage, 'This optional subject is already selected. Please choose another.', 'error');
                        event.target.value = '';
                        marksInput.classList.add('hidden');
                        marksInput.value = '';
                    } else if (selectedValue) {
                        selectedOptional.add({ element: event.target, value: selectedValue });
                        marksInput.classList.remove('hidden');
                    } else {
                        marksInput.classList.add('hidden');
                        marksInput.value = '';
                    }
                });
            }
        } else {
            const p = document.createElement('p');
            p.textContent = 'No specific optional subjects selection required for this student type.';
            p.className = 'text-gray-600 italic';
            optionalSubjectsInputs.appendChild(p);
        }
    }
}

saveMarksBtn.addEventListener('click', () => {
    const selectedStudentName = selectStudentForMarks.value;
    const student = findStudentByName(selectedStudentName);

    if (!student) {
        showMessage(addMarksMessage, 'Please select a student first.', 'error');
        return;
    }

    const newSubjects = [];
    let isValid = true;

    const compulsoryInputs = compulsorySubjectsInputs.querySelectorAll('.subject-input');
    compulsoryInputs.forEach(input => {
        const subjectName = input.dataset.subjectName;
        const marks = parseFloat(input.value);
        if (isNaN(marks) || marks < 0 || marks > 100) {
            showMessage(addMarksMessage, `Invalid marks for ${subjectName}. Please enter a value between 0-100.`, 'error');
            isValid = false;
        } else {
            newSubjects.push(new Subject(subjectName, marks));
        }
    });

    const optionalSelects = optionalSubjectsInputs.querySelectorAll('.optional-subject-select');
    const optionalMarksInputs = optionalSubjectsInputs.querySelectorAll('.optional-marks-input');
    let selectedOptionalCount = 0;
    const selectedOptionalNames = new Set();

    optionalSelects.forEach((select, index) => {
        const subjectName = select.value;
        const marksInput = optionalMarksInputs[index];
        const marks = parseFloat(marksInput.value);

        if (subjectName) {
            selectedOptionalCount++;
            if (selectedOptionalNames.has(subjectName)) {
                showMessage(addMarksMessage, `Duplicate optional subject selected: ${subjectName}.`, 'error');
                isValid = false;
                return;
            }
            selectedOptionalNames.add(subjectName);

            if (isNaN(marks) || marks < 0 || marks > 100) {
                showMessage(addMarksMessage, `Invalid marks for ${subjectName}. Please enter a value between 0-100.`, 'error');
                isValid = false;
            } else {
                newSubjects.push(new Subject(subjectName, marks));
            }
        }
    });

    if ( (student.type === 'OL_STUDENT' || student.type.startsWith('AL_')) && selectedOptionalCount !== 3) {
        showMessage(addMarksMessage, 'Please select exactly 3 optional subjects.', 'error');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    student.subjects = newSubjects;
    saveStudents();
    showMessage(addMarksMessage, `Marks saved for ${student.name}.`, 'success');

    selectStudentForMarks.value = '';
    subjectInputsContainer.classList.add('hidden');
});

viewReportBtn.addEventListener('click', () => {
    const selectedStudentName = selectStudentForReport.value;
    const student = findStudentByName(selectedStudentName);
    studentReportDisplay.classList.add('hidden');
    studentReportDisplay.innerHTML = '';

    if (!student) {
        showMessage(viewReportMessage, 'Please select a student to view report.', 'error');
        return;
    }

    if (student.subjects.length === 0) {
        showMessage(viewReportMessage, 'No subjects and marks added for this student yet.', 'error');
        return;
    }

    const totalMarks = calculateTotalMarks(student);
    const averagePercentage = calculateAveragePercentage(student);
    const letterGrade = getLetterGrade(averagePercentage);

    let subjectsHtml = '';
    student.subjects.forEach(subject => {
        subjectsHtml += `<p class="mb-1"><strong>${subject.name}:</strong> ${subject.marks}/100</p>`;
    });

    studentReportDisplay.classList.remove('hidden');
    studentReportDisplay.innerHTML = `
        <h3 class="text-xl font-bold mb-3 text-blue-900">${student.name}'s Academic Report</h3>
        <p class="mb-2"><strong>Student Type:</strong> ${StudentType[student.type]}</p>
        <div class="mb-3">
            <h4 class="font-semibold text-blue-700">Subjects & Marks:</h4>
            ${subjectsHtml}
        </div>
        <p class="text-lg mb-2"><strong>Total Marks:</strong> <span class="text-blue-900 font-bold">${totalMarks.toFixed(2)}</span></p>
        <p class="text-lg mb-2"><strong>Average Percentage:</strong> <span class="text-blue-900 font-bold">${averagePercentage.toFixed(2)}%</span></p>
        <p class="text-xl"><strong>Letter Grade:</strong> <span class="text-blue-900 font-extrabold">${letterGrade}</span></p>
    `;
    showMessage(viewReportMessage, 'Report generated successfully.', 'success');
});

function renderAllStudents() {
    allStudentsList.innerHTML = '';
    if (students.length === 0) {
        listStudentsMessage.classList.remove('hidden');
        listStudentsMessage.className = 'message';
        listStudentsMessage.textContent = 'No students registered yet.';
        return;
    } else {
        listStudentsMessage.classList.add('hidden');
    }

    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200';
        studentCard.innerHTML = `
            <h3 class="font-semibold text-lg text-gray-800">${student.name}</h3>
            <p class="text-gray-600">${StudentType[student.type]}</p>
            ${student.subjects.length > 0 ? `<p class="text-sm text-gray-500 mt-2">Subjects: ${student.subjects.length}, Total: ${calculateTotalMarks(student).toFixed(2)}, Avg: ${calculateAveragePercentage(student).toFixed(2)}%</p>` : '<p class="text-sm text-gray-500 mt-2">No marks entered yet.</p>'}
        `;
        allStudentsList.appendChild(studentCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    populateStudentDropdowns();
    renderAllStudents();
});
