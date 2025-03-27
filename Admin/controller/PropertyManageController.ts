// src/controllers/propertyManageController.ts
import { Request, Response } from "express";
import prisma from "../config/db.config";
interface PropertyPartyData {
  id?: string;
  propertyId: string;
  tenantId: string;
  vendorId: string;
}

// Custom interface for Rent Data
interface RentData {
  id?: string;
  propertyId: string;
  Amount: string;
  ReceivedOn: Date;
  HoldBy: string;
  ReturnedOn?: Date;
  DateOfAgreement: Date;
  Deposit: any;
  NoOfOccupant: number;
  DssRef: string;
  HowFurnished: string;
  Note: string;
}




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

  // Create a new property party 
 


  // Delete a property party record
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




  static async upsertPropertyParty(req: Request<{}, {}, PropertyPartyData>, res: Response) {
    const { propertyId, tenantId, vendorId } = req.body;
    console.log(tenantId,vendorId,"firqan")
    if (!vendorId)
    {
      return res.status(400).json({ message: "Both Tenant and Vendor must be provided." });
    }
    if (!tenantId ) {
      console.log("adsjajdhsajk")
     
    }

    try {
      const existingEntry = await prisma.propertyParty.findFirst({
        where: { propertyId },
      });
      console.log(existingEntry);
    
      if (existingEntry) {
        // Update existing entry
        const updatedEntry = await prisma.propertyParty.update({
          where: { id: existingEntry.id },
          data: { propertyId, Tenantid:tenantId, VendorId:vendorId },
        });
        return res.status(200).json({ message: "Parties updated successfully!", data: updatedEntry });
      } else {
        // Create new entry
        const newEntry = await prisma.propertyParty.create({
          data: { propertyId, Tenantid:tenantId, VendorId:vendorId },
        });
        return res.status(201).json({ message: "Parties created successfully!", data: newEntry });
      }
    } catch (err) {
      console.error("Error upserting PropertyParty:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Get PropertyParty by Property ID
  static async getPropertyParty(req: Request, res: Response) {
    const { propertyId } = req.params;

    try {
      const parties = await prisma.propertyParty.findMany({
        where: { propertyId },
        include: { Tenant: true, vendor: true }, // Assuming relations exist
      });

      if (!parties.length) {
        return res.status(404).json({ message: "No PropertyParty found for this property." });
      }

      return res.json(parties);
    } catch (err) {
      console.error("Error fetching PropertyParty:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Delete a PropertyParty
  static async deletePropertyParty(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.propertyParty.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      console.error("Error deleting PropertyParty:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }


  static async upsertRent(req: Request, res: Response) {
    const {
      propertyId,
      Amount,
      ReceivedOn,
      HoldBy,
      ReturnedOn,
      DateOfAgreement,
      Deposit,
      NoOfOccupant,
      DssRef,
      HowFurnished,
      Note,
    } = req.body;
  
    console.log("Property ID:", propertyId);
  
    try {
      // Find an existing rent entry by propertyId
      const existingRent = await prisma.rent.findFirst({
        where: { propertyId },
      });
  
      let rent;
  
      if (existingRent) {
        // Update existing rent entry
        rent = await prisma.rent.update({
          where: { id: existingRent.id }, // Use the unique id for updating
          data: {
            Amount,
            ReceivedOn,
            HoldBy,
            ReturnedOn,
            DateOfAgreement,
            Deposit,
            NoOfOccupant,
            DssRef,
            HowFurnished,
            Note,
          },
        });
      } else {
        // Create new rent entry
        rent = await prisma.rent.create({
          data: {
            propertyId,
            Amount,
            ReceivedOn,
            HoldBy,
            ReturnedOn,
            DateOfAgreement,
            Deposit,
            NoOfOccupant,
            DssRef,
            HowFurnished,
            Note,
          },
        });
      }
  
      return res.status(200).json({
        message: "Rent data upserted successfully!",
        rent,
      });
    } catch (err) {
      console.error("Error upserting rent:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  
  

  // ✅ Get Rent Data (Optional filter by propertyId)
  static async getRentData(req: Request, res: Response) {
    const { propertyId, page = 1, limit = 10 } = req.query;

    try {
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const filters: any = {};
      if (propertyId) {
        filters.propertyId = propertyId as string;
      }

      const rents = await prisma.rent.findFirst({
        where: filters,

      });

      const totalRents = await prisma.rent.count({
        where: filters,
      });

      return res.json({
        rents,
        total: totalRents,
        page: pageNumber,
        totalPages: Math.ceil(totalRents / limitNumber),
      });
    } catch (err) {
      console.error("Error fetching rent data:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  


  // Supplier related APIs in your controller (e.g., PropertyManageController or SupplierController)

static async upsertSupplier(req: Request, res: Response) {
  const {
    id, // optional: if provided, the upsert will update an existing supplier
    propertyId,
    electricitySupplier,
    electricityPhone,
    electricityMeterNo,
    electricityReadingOne,
    electricityReadingTwo,
    gasSupplier,
    gasPhone,
    gasMeterNo,
    gasReadingOne,
    gasReadingTwo,
    WaterSupplier,
    WaterPhone,
    WaterMeterNo,
    WaterReadingOne,
    WaterReadingTwo,
    BoroughSupplier,
    BoroughPhone,
    BoroughMeterNo,
    BoroughReadingOne,
    BoroughReadingTwo,
    Phone,
    inventory,
  } = req.body;

  try {
    let supplier;
    if (id) {
      // Attempt to find an existing supplier by id
      const existingSupplier = await prisma.supplier.findUnique({
        where: { id },
      });

      if (existingSupplier) {
        // Update the existing supplier record
        supplier = await prisma.supplier.update({
          where: { id },
          data: {
            propertyId,
            electricitySupplier,
            electricityPhone,
            electricityMeterNo,
            electricityReadingOne,
            electricityReadingTwo,
            gasSupplier,
            gasPhone,
            gasMeterNo,
            gasReadingOne,
            gasReadingTwo,
            WaterSupplier,
            WaterPhone,
            WaterMeterNo,
            WaterReadingOne,
            WaterReadingTwo,
            BoroughSupplier,
            BoroughPhone,
            BoroughMeterNo,
            BoroughReadingOne,
            BoroughReadingTwo,
            Phone,
            inventory,
          },
        });
      } else {
        // If no supplier is found with the given id, create a new record
        supplier = await prisma.supplier.create({
          data: {
            propertyId,
            electricitySupplier,
            electricityPhone,
            electricityMeterNo,
            electricityReadingOne,
            electricityReadingTwo,
            gasSupplier,
            gasPhone,
            gasMeterNo,
            gasReadingOne,
            gasReadingTwo,
            WaterSupplier,
            WaterPhone,
            WaterMeterNo,
            WaterReadingOne,
            WaterReadingTwo,
            BoroughSupplier,
            BoroughPhone,
            BoroughMeterNo,
            BoroughReadingOne,
            BoroughReadingTwo,
            Phone,
            inventory,
          },
        });
      }
    } else {
      // If no id is provided, create a new supplier entry
      supplier = await prisma.supplier.create({
        data: {
          propertyId,
          electricitySupplier,
          electricityPhone,
          electricityMeterNo,
          electricityReadingOne,
          electricityReadingTwo,
          gasSupplier,
          gasPhone,
          gasMeterNo,
          gasReadingOne,
          gasReadingTwo,
          WaterSupplier,
          WaterPhone,
          WaterMeterNo,
          WaterReadingOne,
          WaterReadingTwo,
          BoroughSupplier,
          BoroughPhone,
          BoroughMeterNo,
          BoroughReadingOne,
          BoroughReadingTwo,
          Phone,
          inventory,
        },
      });
    }

    return res.status(200).json({
      message: "Supplier upserted successfully!",
      supplier,
    });
  } catch (err) {
    console.error("Error upserting supplier:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}

static async getSupplierData(req: Request, res: Response) {
  // We assume supplier id is passed as a route parameter
  const { propertyId } = req.params;

  try {      const filters: any = {};
          if (propertyId) {
        filters.propertyId = propertyId as string;
      }

    const supplier = await prisma.supplier.findFirst({
      where: filters,
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({ supplier });
  } catch (err) {
    console.error("Error fetching supplier data:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
}


static async upsertTenancyAgreement(req: Request, res: Response) {
  const {
    propertyId,
    tenantId,
    details,
    housingAct,
    LetterType,
    TermsandCondition,
    Guaranteer,
    Address1,
    Address2,
    HideLandlordAdress,
    signedDate, // Optional DateTime
  } = req.body;

  try {
    console.log(propertyId)
    
    // Find an existing tenancy agreement by propertyId
    const existingAgreement = await prisma.tenancyAgreement.findFirst({
      where: { propertyId },
    });

    let agreement;
    console.log(HideLandlordAdress)
    if (existingAgreement) {
      // Update existing agreement
      agreement = await prisma.tenancyAgreement.update({
        where: { id: existingAgreement.id },
        data: {
          tenantId,
          details,
          housingAct,
          LetterType,
          TermsandCondition,
          Guaranteer,
          Address1,
          Address2,
          HideLandlordAdress,
          signedDate,
        },
      });
    } else {
      // Create new tenancy agreement
      agreement = await prisma.tenancyAgreement.create({
        data: {
          propertyId,
          tenantId,
          details,
          housingAct,
          LetterType,
          TermsandCondition,
          Guaranteer,
          Address1,
          Address2,
          HideLandlordAdress,
          signedDate,
        },
      });
    }

    return res.status(200).json({
      message: "Tenancy Agreement upserted successfully!",
      agreement,
    });
  } catch (err) {
    console.error("Error upserting tenancy agreement:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
}

static async getTenancyAgreementData(req: Request, res: Response) {
  const { propertyId } = req.params; // Expecting propertyId as route parameter
console.log(propertyId)
  try {
    const agreement = await prisma.tenancyAgreement.findFirst({
      where: { propertyId },
    });

    if (!agreement) {
      return res.status(404).json({ message: "Tenancy Agreement not found" });
    }

    return res.status(200).json({ agreement });
  } catch (err) {
    console.error("Error fetching tenancy agreement:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
}

// ------------------- ManagementAgreements Methods -------------------
static async upsertManagementAgreement(req: Request, res: Response) {
  const {
    propertyId,
    DateofAgreement,
    AgreementStart,
    PaymentAgreement,
    AgreementEnd,
    Frequency,
    InventoryCharges,
    ManagementFees,
    TermsAndCondition,
  } = req.body;

  try {
    // Find an existing management agreement by propertyId
    const existingAgreement = await prisma.managementAgreement.findFirst({
      where: { propertyId },
    });

    let agreement;

    if (existingAgreement) {
      // Update existing management agreement
      agreement = await prisma.managementAgreement.update({
        where: { id: existingAgreement.id },
        data: {
          DateofAgreement,
          AgreementStart,
          PaymentAgreement,
          AgreementEnd,
          Frequency,
          InventoryCharges,
          ManagementFees,
          TermsAndCondition,
        },
      });
    } else {
      // Create new management agreement
      agreement = await prisma.managementAgreement.create({
        data: {
          propertyId,
          DateofAgreement,
          AgreementStart,
          PaymentAgreement,
          AgreementEnd,
          Frequency,
          InventoryCharges,
          ManagementFees,
          TermsAndCondition,
        },
      });
    }

    return res.status(200).json({
      message: "Management Agreement upserted successfully!",
      agreement,
    });
  } catch (err) {
    console.error("Error upserting management agreement:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
}

static async getManagementAgreementData(req: Request, res: Response) {
  const { propertyId } = req.params; // Expecting propertyId as route parameter
console.log(propertyId)
  try {
    const agreement = await prisma.managementAgreement.findFirst({
      where: { propertyId },
    });

    if (!agreement) {
      return res.status(404).json({ message: "Management Agreement not found" });
    }

    return res.status(200).json({ agreement });
  } catch (err) {
    console.error("Error fetching management agreement:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
}




}

export default PropertyManageController;
