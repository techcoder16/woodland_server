// src/controllers/propertyManageController.ts
import { Request, Response } from "express";
import prisma from "../config/db.config";


// Controller class for managing additional property-related models
class PropertyManageController {


  static async upsertFeature(req: Request, res: Response) {
    const {
      propertyId,
      featureType,
      value,
      towns,
      PostCode,
      noOfDeds,
      NoOfWC,
      NoOfReceptions,
      NoOfCookRooms,
      Garden,
      Carpeting,
      GasControlMeeting,
      DoubleGazing,
      OffStreetParking,
      Garage,
      keyNumber,
      Type,
      HowDeattached,
      Floor,
      DoorNumber,
      Road,
      map
    } = req.body;

    // Validate required fields.
    if (!propertyId || !featureType) {
      return res.status(400).json({
        message: "propertyId and featureType are required",
      });
    }
  
    try {
      // Handle file uploads for the map field.
 
  
      // Build the data object for creation/updating.
      const data: any = {
        propertyId,
        featureType,
        value,
        towns,
        PostCode,
        noOfDeds,
        NoOfWC,
        NoOfReceptions,
        NoOfCookRooms,
        Garden,
        Carpeting,
        GasControlMeeting,
        DoubleGazing,
        OffStreetParking:
          OffStreetParking !== undefined
            ? OffStreetParking === "true" || OffStreetParking === true
            : undefined,
        Garage,
        keyNumber: keyNumber ? parseFloat(keyNumber) : undefined,
        Type,
        HowDeattached,
        Floor,
        DoorNumber,
        Road,
        map,
      };
  
      // First, check if a record exists with the given propertyId.
      const existingFeature = await prisma.additionalPropertyFeature.findFirst({
        where: { propertyId },
      });
  
      let feature;
      if (existingFeature) {
        // Update the existing record using its unique id.
        feature = await prisma.additionalPropertyFeature.update({
          where: { id: existingFeature.id },
          data: {
            ...data,
       
          },
        });
      } else {
        // Create a new record if none exists.
        feature = await prisma.additionalPropertyFeature.create({
          data,
        });
      }
  
      return res.status(200).json({ message: "Feature upserted", feature });
    } catch (error) {
      console.error("Error upserting feature:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  
  

  
  // Get features for a specific property
  static async getFeatures(req: Request, res: Response) {
    const { propertyId } = req.query;

    console.log(propertyId)
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const features = await prisma.additionalPropertyFeature.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ features });
    } catch (error) {
      console.error("Error fetching features:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update an additional property feature
 



  // -------------------------------
  // Property Party CRUD
  // (Associates parties (tenant, landlord, etc.) with a property)
  // -------------------------------

  // Create a new property party record
 

  // Get all parties associated with a property
  static async getPropertyParties(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const propertyParties = await prisma.propertyParty.findMany({
        where: { propertyId: String(propertyId) },
      
      });
      return res.json({ propertyParties });
    } catch (error) {
      console.error("Error fetching property parties:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a property party record (e.g., update role)
  static async updatePropertyParty(
    req: Request<{ id: string }, {}, { role?: string }>,
    res: Response
  ) {
    const { id } = req.params;
    const { role } = req.body;
    try {
      const updatedParty = await prisma.propertyParty.update({
        where: { id },
        data: {}
      });
      return res.json({ message: "Property party updated", propertyParty: updatedParty });
    } catch (error) {
      console.error("Error updating property party:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a property party record
  static async deletePropertyParty(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.propertyParty.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting property party:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // Lease CRUD
  // (Manage rent/deposit, agreement dates, etc.)
  // -------------------------------

  // Create a new lease record
  static async createLease(req: Request, res: Response) {
    const { propertyId, tenantId, landlordId, rent, deposit, agreementDate, startDate, endDate } = req.body;
    if (!propertyId || !tenantId || !landlordId || rent === undefined || deposit === undefined || !startDate) {
      return res.status(400).json({ message: "Missing required lease fields" });
    }
    try {
      const lease = await prisma.lease.create({
        data: {
          propertyId,
          tenantId,
          landlordId,
          rent: parseFloat(rent),
          deposit: parseFloat(deposit),
          agreementDate: agreementDate ? new Date(agreementDate) : null,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
        },
      });
      return res.status(201).json({ message: "Lease created", lease });
    } catch (error) {
      console.error("Error creating lease:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get leases (optionally filtered by property)
  static async getLeases(req: Request, res: Response) {
    const { propertyId } = req.query;
    const filters: any = {};
    if (propertyId) filters.propertyId = String(propertyId);
    try {
      const leases = await prisma.lease.findMany({ where: filters });
      return res.json({ leases });
    } catch (error) {
      console.error("Error fetching leases:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update an existing lease
  static async updateLease(req: Request<{ id: string }, {}, any>, res: Response) {
    const { id } = req.params;
    const data = req.body;
    // Convert numeric and date fields as needed
    if (data.rent !== undefined) data.rent = parseFloat(data.rent);
    if (data.deposit !== undefined) data.deposit = parseFloat(data.deposit);
    if (data.agreementDate) data.agreementDate = new Date(data.agreementDate);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    try {
      const updatedLease = await prisma.lease.update({
        where: { id },
        data,
      });
      return res.json({ message: "Lease updated", lease: updatedLease });
    } catch (error) {
      console.error("Error updating lease:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a lease record
  static async deleteLease(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.lease.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting lease:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // Meter CRUD
  // (Manage supplier/inventory and meter readings)
  // -------------------------------

  // Create a new meter record
  static async createMeter(req: Request, res: Response) {
    const { propertyId, meterType, reading, lastReadingDate } = req.body;
    if (!propertyId || !meterType) {
      return res.status(400).json({ message: "propertyId and meterType are required" });
    }
    try {
      const meter = await prisma.meter.create({
        data: {
          propertyId,
          meterType,
          reading: reading !== undefined ? parseFloat(reading) : null,
          lastReadingDate: lastReadingDate ? new Date(lastReadingDate) : null,
        },
      });
      return res.status(201).json({ message: "Meter created", meter });
    } catch (error) {
      console.error("Error creating meter:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get meters for a specific property
  static async getMeters(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const meters = await prisma.meter.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ meters });
    } catch (error) {
      console.error("Error fetching meters:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a meter record
  static async updateMeter(req: Request<{ id: string }, {}, any>, res: Response) {
    const { id } = req.params;
    const data = req.body;
    if (data.reading !== undefined) data.reading = parseFloat(data.reading);
    if (data.lastReadingDate) data.lastReadingDate = new Date(data.lastReadingDate);
    try {
      const updatedMeter = await prisma.meter.update({
        where: { id },
        data,
      });
      return res.json({ message: "Meter updated", meter: updatedMeter });
    } catch (error) {
      console.error("Error updating meter:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a meter record
  static async deleteMeter(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.meter.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting meter:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // Management Agreement CRUD
  // -------------------------------

  // Create a management agreement record
  static async createManagementAgreement(req: Request, res: Response) {
    const { propertyId, details, signedDate } = req.body;
    if (!propertyId || !details) {
      return res.status(400).json({ message: "propertyId and details are required" });
    }
    try {
      const agreement = await prisma.managementAgreement.create({
        data: {
          propertyId,
          details,
          signedDate: signedDate ? new Date(signedDate) : null,
        },
      });
      return res.status(201).json({ message: "Management agreement created", agreement });
    } catch (error) {
      console.error("Error creating management agreement:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get management agreements for a property
  static async getManagementAgreements(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const agreements = await prisma.managementAgreement.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ agreements });
    } catch (error) {
      console.error("Error fetching management agreements:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a management agreement
  static async updateManagementAgreement(req: Request<{ id: string }, {}, any>, res: Response) {
    const { id } = req.params;
    const data = req.body;
    if (data.signedDate) data.signedDate = new Date(data.signedDate);
    try {
      const updatedAgreement = await prisma.managementAgreement.update({
        where: { id },
        data,
      });
      return res.json({ message: "Management agreement updated", agreement: updatedAgreement });
    } catch (error) {
      console.error("Error updating management agreement:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a management agreement
  static async deleteManagementAgreement(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.managementAgreement.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting management agreement:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // Tenancy Agreement CRUD
  // -------------------------------

  // Create a tenancy agreement record
  static async createTenancyAgreement(req: Request, res: Response) {
    const { propertyId, tenantId, details, signedDate } = req.body;
    if (!propertyId || !tenantId || !details) {
      return res.status(400).json({ message: "propertyId, tenantId and details are required" });
    }
    try {
      const agreement = await prisma.tenancyAgreement.create({
        data: {
          propertyId,
          tenantId,
          details,
          signedDate: signedDate ? new Date(signedDate) : null,
        },
      });
      return res.status(201).json({ message: "Tenancy agreement created", agreement });
    } catch (error) {
      console.error("Error creating tenancy agreement:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get tenancy agreements for a property
  static async getTenancyAgreements(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const agreements = await prisma.tenancyAgreement.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ agreements });
    } catch (error) {
      console.error("Error fetching tenancy agreements:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a tenancy agreement
  static async updateTenancyAgreement(req: Request<{ id: string }, {}, any>, res: Response) {
    const { id } = req.params;
    const data = req.body;
    if (data.signedDate) data.signedDate = new Date(data.signedDate);
    try {
      const updatedAgreement = await prisma.tenancyAgreement.update({
        where: { id },
        data,
      });
      return res.json({ message: "Tenancy agreement updated", agreement: updatedAgreement });
    } catch (error) {
      console.error("Error updating tenancy agreement:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a tenancy agreement
  static async deleteTenancyAgreement(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.tenancyAgreement.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting tenancy agreement:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // Transaction CRUD
  // -------------------------------

  // Create a new transaction
  static async createTransaction(req: Request, res: Response) {
    const { propertyId, amount, transactionDate, type, description } = req.body;
    if (!propertyId || amount === undefined || !transactionDate || !type) {
      return res.status(400).json({ message: "Missing required transaction fields" });
    }
    try {
      const transaction = await prisma.transaction.create({
        data: {
          propertyId,
          amount: parseFloat(amount),
          transactionDate: new Date(transactionDate),
          type,
          description,
        },
      });
      return res.status(201).json({ message: "Transaction created", transaction });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get transactions for a property
  static async getTransactions(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const transactions = await prisma.transaction.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a transaction
  static async updateTransaction(req: Request<{ id: string }, {}, any>, res: Response) {
    const { id } = req.params;
    const data = req.body;
    if (data.amount !== undefined) data.amount = parseFloat(data.amount);
    if (data.transactionDate) data.transactionDate = new Date(data.transactionDate);
    try {
      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data,
      });
      return res.json({ message: "Transaction updated", transaction: updatedTransaction });
    } catch (error) {
      console.error("Error updating transaction:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a transaction
  static async deleteTransaction(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.transaction.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // Note CRUD
  // -------------------------------

  // Create a new note
  static async createNote(req: Request, res: Response) {
    const { propertyId, content } = req.body;
    if (!propertyId || !content) {
      return res.status(400).json({ message: "propertyId and content are required" });
    }
    try {
      const note = await prisma.note.create({
        data: { propertyId, content },
      });
      return res.status(201).json({ message: "Note created", note });
    } catch (error) {
      console.error("Error creating note:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get notes for a property
  static async getNotes(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const notes = await prisma.note.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ notes });
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a note
  static async updateNote(
    req: Request<{ id: string }, {}, { content?: string }>,
    res: Response
  ) {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: { content },
      });
      return res.json({ message: "Note updated", note: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a note
  static async deleteNote(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.note.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // -------------------------------
  // History CRUD
  // -------------------------------

  // Create a new history record
  static async createHistory(req: Request, res: Response) {
    const { propertyId, action } = req.body;
    if (!propertyId || !action) {
      return res.status(400).json({ message: "propertyId and action are required" });
    }
    try {
      const history = await prisma.history.create({
        data: { propertyId, action },
      });
      return res.status(201).json({ message: "History created", history });
    } catch (error) {
      console.error("Error creating history:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Get history records for a property
  static async getHistories(req: Request, res: Response) {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }
    try {
      const histories = await prisma.history.findMany({
        where: { propertyId: String(propertyId) },
      });
      return res.json({ histories });
    } catch (error) {
      console.error("Error fetching histories:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Update a history record
  static async updateHistory(
    req: Request<{ id: string }, {}, { action?: string }>,
    res: Response
  ) {
    const { id } = req.params;
    const { action } = req.body;
    try {
      const updatedHistory = await prisma.history.update({
        where: { id },
        data: { action },
      });
      return res.json({ message: "History updated", history: updatedHistory });
    } catch (error) {
      console.error("Error updating history:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  // Delete a history record
  static async deleteHistory(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    try {
      await prisma.history.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting history:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
}

export default PropertyManageController;
