import { expect } from "chai";
import hre from "hardhat";

describe("Hospital", function () {
  let Hospital;
  let hospital;
  let owner;
  let doctorAddr;
  let otherAddr;

  beforeEach(async function () {
    Hospital = await hre.ethers.getContractFactory("Hospital");
    [owner, doctorAddr, otherAddr] = await hre.ethers.getSigners();
    hospital = await Hospital.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await hospital.admin()).to.equal(owner.address);
    });
  });

  describe("Doctor Management", function () {
    it("Should allow admin to add a doctor", async function () {
      await hospital.addDoctor(doctorAddr.address, "Dr. Smith", "Cardiology");
      const doctor = await hospital.getDoctor(doctorAddr.address);

      expect(doctor.name).to.equal("Dr. Smith");
      expect(doctor.specialization).to.equal("Cardiology");
      expect(doctor.isRegistered).to.be.true;
    });

    it("Should not allow non-admin to add a doctor", async function () {
      await expect(hospital.connect(otherAddr).addDoctor(doctorAddr.address, "Dr. Jones", "Neurology"))
        .to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Patient Management", function () {
    it("Should allow admin to add a patient", async function () {
      await hospital.addPatient("John Doe", 30);
      const patient = await hospital.getPatient(1);

      expect(patient.name).to.equal("John Doe");
      expect(patient.age).to.equal(30n);
      expect(patient.isRegistered).to.be.true;
    });

    it("Should not allow non-admin to add a patient", async function () {
      await expect(hospital.connect(otherAddr).addPatient("Jane Doe", 25))
        .to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Medical Records", function () {
    beforeEach(async function () {
      await hospital.addDoctor(doctorAddr.address, "Dr. Smith", "Cardiology");
      await hospital.addPatient("John Doe", 30);
    });

    it("Should allow a registered doctor to add a medical record", async function () {
      await hospital.connect(doctorAddr).addRecord(1, "Heart condition", "Rest and medication");

      const records = await hospital.getPatientRecords(1);
      expect(records.length).to.equal(1);
      expect(records[0].diagnosis).to.equal("Heart condition");
      expect(records[0].treatment).to.equal("Rest and medication");
      expect(records[0].doctorAddress).to.equal(doctorAddr.address);
    });

    it("Should fail if patient is not registered", async function () {
      await expect(hospital.connect(doctorAddr).addRecord(99, "Diagnosis", "Treatment"))
        .to.be.revertedWith("Patient is not registered");
    });

    it("Should fail if caller is not a registered doctor", async function () {
      await expect(hospital.connect(otherAddr).addRecord(1, "Diagnosis", "Treatment"))
        .to.be.revertedWith("Caller is not a registered doctor");
    });
  });
});
