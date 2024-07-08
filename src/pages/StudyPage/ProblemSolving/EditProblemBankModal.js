import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import UniversalModal from '../../../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import API from '../../../api/AxiosInstance';

const EditProblemBankModal = ({ show, handleClose, problemBank }) => {
    const [bankName, setBankName] = useState(problemBank.problemBankName);
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        if (show) {
            setBankName(problemBank.problemBankName);
            fetchProblemBankData();
        }
    }, [show, problemBank]);

    const fetchProblemBankData = async () => {
        try {
            const response = await API.get(`/study/${problemBank.studyPk}/problem/bank/${problemBank.pk}`);
            setProblems(response.data.problemList);
        } catch (error) {
            console.error('문제를 불러오는 데 실패했습니다:', error);
        }
    };

    const handleBankNameChange = (e) => setBankName(e.target.value);

    const handleSaveBankName = async () => {
        console.log('Saving new bank name: ', bankName);
        try {
            await API.put(`/study/${problemBank.studyPk}/problem/bank`, {
                problemBankPk: problemBank.pk,
                problemBankName: bankName,
            });
            alert('문제은행 이름이 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('문제은행 이름을 저장하는 데 실패했습니다:', error);
        }
    };

    const handleProblemChange = (index, key, value) => {
        const updatedProblems = [...problems];
        updatedProblems[index][key] = value;
        setProblems(updatedProblems);
    };

    const handleOptionChange = (pIndex, oIndex, value) => {
        const updatedProblems = [...problems];
        updatedProblems[pIndex].options[oIndex].content = value;
        setProblems(updatedProblems);
    };

    const handleSaveProblem = async (index) => {
        const problem = problems[index];
        const requestData = {
            problemPk: problem.problemPk,
            problemContent: problem.problemContent,
            answer: problem.answerPk,
            ProblemExplanation: problem.problemExplanation,
            problemOptionRequestDTOList: problem.options.map((opt) => ({
                content: opt.content,
                num: opt.num,
            })),
        };
        console.log('Saving problem: ', requestData);
        try {
            await API.put(`/study/${problemBank.studyPk}/problem`, requestData);
            alert('문제가 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('문제를 저장하는 데 실패했습니다:', error);
        }
    };

    return (
        <UniversalModal show={show} handleClose={handleClose} title={bankName} backdrop="static">
            <Form>
                <Form.Group>
                    <Form.Label>문제은행 제목 : {bankName}</Form.Label>
                    <Form.Control type="text" value={bankName} onChange={handleBankNameChange} />
                    <Button
                        variant="outline-success"
                        onClick={handleSaveBankName}
                        className="mb-3"
                        style={{ marginTop: '5px' }}
                    >
                        저장
                    </Button>
                </Form.Group>
                {problems.length > 0 &&
                    problems.map((problem, index) => (
                        <div key={index}>
                            <Form.Group>
                                <Form.Label>Q: {problem.problemContent}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={problem.problemContent}
                                    onChange={(e) => handleProblemChange(index, 'problemContent', e.target.value)}
                                />
                                {problem.options.map((option, optIndex) => (
                                    <InputGroup className="mb-3" key={optIndex}>
                                        <InputGroup.Text>{optIndex + 1}</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            value={option.content}
                                            onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                        />
                                    </InputGroup>
                                ))}
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>정답번호</InputGroup.Text>
                                    <Form.Select
                                        value={problem.answerPk}
                                        onChange={(e) => handleProblemChange(index, 'answerPk', e.target.value)}
                                    >
                                        {problem.options.map((opt, optIndex) => (
                                            <option key={optIndex} value={opt.problemOptionPk}>
                                                {opt.num}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </InputGroup>
                                <Form.Group>
                                    <Form.Label>해설</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={problem.problemExplanation}
                                        onChange={(e) =>
                                            handleProblemChange(index, 'problemExplanation', e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Button
                                    variant="outline-success"
                                    onClick={() => handleSaveProblem(index)}
                                    className="mb-3"
                                    style={{ marginTop: '5px' }}
                                >
                                    저장
                                </Button>
                            </Form.Group>
                        </div>
                    ))}
                <Button variant="secondary" onClick={handleClose} className="mt-2">
                    닫기
                </Button>
            </Form>
        </UniversalModal>
    );
};

const EditProblemBankButton = ({ problemBank }) => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Button
                onClick={handleOpenModal}
                variant="link"
                className="edit-button"
                style={{ marginRight: '10px', color: '#919191', border: 'none' }}
            >
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            {showModal && (
                <EditProblemBankModal show={showModal} handleClose={handleCloseModal} problemBank={problemBank} />
            )}
        </>
    );
};

export default EditProblemBankButton;