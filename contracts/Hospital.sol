// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Hospital {
    address public admin;

    struct Doctor {
        address doctorAddress;
        string name;
        string specialization;
        bool isRegistered;
    }

    struct Patient {
        uint256 id;
        string name;
        uint256 age;
        bool isRegistered;
    }

    struct Record {
        uint256 recordId;
        uint256 patientId;
        address doctorAddress;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    mapping(address => Doctor) public doctors;
    mapping(uint256 => Patient) public patients;
    mapping(uint256 => Record[]) public patientRecords;

    uint256 public patientCount;
    uint256 public recordCount;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegisteredDoctor() {
        require(doctors[msg.sender].isRegistered, "Caller is not a registered doctor");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addDoctor(address _doctorAddress, string memory _name, string memory _specialization) public onlyAdmin {
        require(!doctors[_doctorAddress].isRegistered, "Doctor already registered");
        doctors[_doctorAddress] = Doctor(_doctorAddress, _name, _specialization, true);
    }

    function addPatient(string memory _name, uint256 _age) public onlyAdmin {
        patientCount++;
        patients[patientCount] = Patient(patientCount, _name, _age, true);
    }

    function addRecord(uint256 _patientId, string memory _diagnosis, string memory _treatment) public onlyRegisteredDoctor {
        require(patients[_patientId].isRegistered, "Patient is not registered");
        recordCount++;
        patientRecords[_patientId].push(Record(recordCount, _patientId, msg.sender, _diagnosis, _treatment, block.timestamp));
    }

    function getPatientRecords(uint256 _patientId) public view returns (Record[] memory) {
        require(patients[_patientId].isRegistered, "Patient is not registered");
        return patientRecords[_patientId];
    }

    function getDoctor(address _doctorAddress) public view returns (Doctor memory) {
        require(doctors[_doctorAddress].isRegistered, "Doctor is not registered");
        return doctors[_doctorAddress];
    }

    function getPatient(uint256 _patientId) public view returns (Patient memory) {
        require(patients[_patientId].isRegistered, "Patient is not registered");
        return patients[_patientId];
    }
}
