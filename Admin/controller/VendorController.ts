import prisma from "../config/db.config"; // Prisma client
import bcrypt from "bcryptjs"; // bcrypt for password hashing
import { Request, Response } from "express";

// Custom interface for Vendor Data
interface VendorData {
  id:string,
  landlord?: boolean;
  vendor?: boolean;
  type: 'Individual' | 'Company';
  title: 'mr' | 'mrs' | 'miss' | 'ms' | 'dr' | 'prof';
  firstName: string;
  lastName: string;
  company?: string | null;
  salutation?: string | null;
  postCode: string;
  addressLine1: string;
  addressLine2?: string | null;
  town?: string | null;
  country?: string | null;
  phoneHome?: string | null;
  phoneWork?: string | null;
  
  phoneMobile?: string | null;
  fax?: string | null;
  email: string | null;
  website?: string | null;
  pager?: string | null;
  birthplace?: string | null;
  nationality?: string | null;
  passportNumber?: string | null;
  acceptLHA?: string | null;
  dnrvfn?: boolean;
  label?: string | null;
  status?: string | null;
  branch?: string | null;
  source?: string | null;
  ldhor?: boolean;

  salesFee?: string | null;
  managementFee?: string | null;
  findersFee?: string | null;
  salesFeeA?: string | null;
  managementFeeA?: string | null;
  findersFeeA?: string | null;
  nrlRef?: string | null;
  nrlTax?:string  | null;
  nrlRate?: string | null;
  vatNumber?: string | null;
  landlordFullName?: string | null;
  landlordContact?: string | null;
  comments?: string | null;
  otherInfo?: string | null;
  bankBody?: string | null;
  bankAddressLine1?: string | null;
  bankAddressLine2?: string | null;
  bankTown?: string | null;
  bankPostCode?: string | null;
  bankCountry?: string | null;
  bankIban?: string | null;
  bic?: string | null;
  nib?: string | null;
  accountOption: 'noAccount' | 'createAccount' | 'existingAccount';
  username?: string | null;
  password?: string | null;
  existingUsername?: string | null;
  attachments?: any[]; // Optional Attachments array
  negotiator?:string | null;
}


   const parseBoolean = (value: any) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null; // Handle unexpected values
};


// Create Vendor Controller
class VendorController {


  // Create a new Vendor
  static async createVendor(req: Request<{}, {}, VendorData>, res: Response) {
    const {
      landlord,
      vendor,
      type,
      title,
      firstName,
      lastName,
      company,
      salutation,
      postCode,
      addressLine1,
      addressLine2,
      town,
      country,
      phoneHome,
      phoneMobile,
      fax,
      email,
      website,
      pager,
      birthplace,
      nationality,
      passportNumber,
      acceptLHA,
      dnrvfn,
      label,
      status,
      
      branch,
      source,
      ldhor,
      salesFee,
      managementFee,
      findersFee,
      salesFeeA,
      managementFeeA,
      findersFeeA,
      nrlRef,
      nrlRate,
      nrlTax,
      vatNumber,
      landlordFullName,
      landlordContact,
      comments,
      otherInfo,
      bankBody,
      bankAddressLine1,
      bankAddressLine2,
      bankTown,
      bankPostCode,
      bankCountry,
      bankIban,
      bic,
      nib,
      accountOption,
      username,
      password,
      existingUsername,
      phoneWork,
      negotiator,
    } = req.body;
  
    console.log({
      landlord,
      vendor,
      type,
      title,
      firstName,
      lastName,
      company,
      salutation,
      postCode,
      addressLine1,
      addressLine2,
      town,
      country,
      phoneHome,
      phoneMobile,
      fax,
      email,
      website,
      pager,
      birthplace,
      nationality,
      passportNumber,
      acceptLHA,
      dnrvfn,
      label,
      status,
      
      branch,
      source,
      ldhor,  
      salesFee,
      managementFee,
      findersFee,
      salesFeeA,
      managementFeeA,
      findersFeeA,
      nrlRef,
      nrlTax,
      nrlRate,
      vatNumber,
      landlordFullName,
      landlordContact,
      comments,
      otherInfo,
      bankBody,
      bankAddressLine1,
      bankAddressLine2,
      bankTown,
      bankPostCode,
      bankCountry,
      bankIban,
      bic,
      nib,
      accountOption,
      username,
      password,
      existingUsername,
      phoneWork,
      negotiator,
    });

    // Access the uploaded files (with multer)

    const attachments = req.body.attachments;
  
    if (!attachments || attachments.length === 0) {
      return res.status(400).json({ message: 'No files uploaded!' });
    }
  
    // Parse landlord and vendor fields to booleans
    const landlordBoolean = parseBoolean(landlord);
    const vendorBoolean = parseBoolean(vendor);
    const dnrvfnBoolean = parseBoolean(dnrvfn);
    const ldhorBoolean = parseBoolean(ldhor);
    
    try {
      // Validation check for required fields
      if (!firstName || !lastName ) {
        return res.status(400).send({ message: "First Name, Last Name, and Email are required!" });
      }
  
      // Check if the vendor already exists by email
      const existingVendor = await prisma.vendor.findFirst({ where: { email } });
      if (existingVendor) {
        return res.status(400).send({ message: "Vendor with this email already exists!" });
      }
  
      // If account is to be created, hash the password
      let hashedPassword: string | undefined = undefined;
      if (accountOption === "createAccount" && password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Prepare the file paths for attachments (empty array if no files)
      // const attachmentsArray = attachments.length > 0 ? attachments.map(file => file.path) : [];
      // console.log(attachments)

      // Create the vendor in the database
      const newVendor = await prisma.vendor.create({
        data: {
          landlord: landlordBoolean,
          vendor: vendorBoolean,
          type,
          title,
          firstName,
          lastName,
          company,
          salutation,
          postCode,
          addressLine1,
          addressLine2,
          town,
          country,
          phoneHome,
          phoneMobile,
          fax,
          email,
          website,
          pager,
          birthplace,
          nationality,
          passportNumber,
          acceptLHA,
          dnrvfn:dnrvfnBoolean,
          label,
          status,
          branch,
          source,
          ldhor:ldhorBoolean,
          salesFee,
          managementFee,
          findersFee,
          salesFeeA,
          managementFeeA,
          findersFeeA,
          nrlRef,
          nrlTax,
          nrlRate,
          vatNumber,
          landlordFullName,
          landlordContact,
          comments,
          otherInfo,
          bankBody,
          bankAddressLine1,
          bankAddressLine2,
          bankTown,
          bankPostCode,
          bankCountry,
          bankIban,
          bic,
          nib,
          accountOption,
          username,
          password: hashedPassword,
          existingUsername,
          attachments: attachments, // Store file paths in the database
          phoneWork,
          negotiator,
        },
      });
  
      return res.status(201).send({
        message: "Vendor created successfully!",
        vendor: newVendor,
      });
    } catch (err) {
      console.error("Error creating vendor:", err);
      return res.status(500).send({ message: "Internal Server Error", error: err });
    }
  }

  // Get Vendors with Pagination, Search and Filters
  static async getVendors(req: Request, res: Response): Promise<Response> {
    const { page = 1, limit = 10, search, category, status, source, vendor, city, town, address, startDate, endDate, phone } = req.query;

    try {
        // Parse query parameters
        const searchString = search as string;
        const categoryString = category as string;
        const statusString = status as string;
        const sourceString = source as string;
        const vendorString = vendor as string;
        const cityString = city as string;
        const townString = town as string;
        const addressString = address as string;
        const phoneString = phone as string;
        const startDateString = startDate as string;
        const endDateString = endDate as string;

        // Construct filters dynamically
        const filters: any = {};

        if (searchString) {
            filters.OR = [
                { firstName: { contains: searchString, mode: "insensitive" } },
                { lastName: { contains: searchString, mode: "insensitive" } },
                { email: { contains: searchString, mode: "insensitive" } },
            ];
        }
        if (categoryString) filters.label = categoryString;
        if (statusString) filters.status = statusString;
        if (sourceString) filters.source = sourceString;
        if (vendorString) filters.vendor = vendorString === 'true';
        if (cityString) filters.city = { contains: cityString, mode: "insensitive" };
        if (townString) filters.town = { contains: townString, mode: "insensitive" };
        if (addressString) filters.addressLine1 = { contains: addressString, mode: "insensitive" };
        if (phoneString) filters.phoneNumber = { contains: phoneString, mode: "insensitive" };

        // Date range filter
        if (startDateString && endDateString) {
            filters.createdAt = {
                gte: new Date(startDateString),
                lte: new Date(endDateString),
            };
        }

        const vendors = await prisma.vendor.findMany({
            where: filters,
            skip: (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10),
            take: parseInt(limit as string, 10),
        });

        const totalVendors = await prisma.vendor.count({ where: filters });

        return res.json({
            vendors,
            total: totalVendors,
            page: parseInt(page as string, 10),
            totalPages: Math.ceil(totalVendors / parseInt(limit as string, 10)),
        });
    } catch (err) {
        console.error("Error fetching vendors:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
}
 static async updateVendor(req: Request<{ id: string }, {}, VendorData>, res: Response) {

      const {
        id,
        landlord,
        vendor,
        type,
        title,
        firstName,
        lastName,
        company,
        salutation,
        postCode,
        addressLine1,
        addressLine2,
        town,
        country,
        phoneHome,
        phoneMobile,
        fax,
        email,
        website,
        pager,
        birthplace,
        nationality,
        passportNumber,
        acceptLHA,
        dnrvfn,
        label,
        status,
        
        branch,
        source,
        ldhor,
        salesFee,
        managementFee,
        findersFee,
        salesFeeA,
        managementFeeA,
        findersFeeA,
        nrlRef,
        nrlRate,
        nrlTax,
        vatNumber,
        landlordFullName,
        landlordContact,
        comments,
        otherInfo,
        bankBody,
        bankAddressLine1,
        bankAddressLine2,
        bankTown,
        bankPostCode,
        bankCountry,
        bankIban,
        bic,
        nib,
        accountOption,
        username,
        password,
        existingUsername,
        phoneWork,
        negotiator,
        attachments,
      } = req.body;
    if (!id) {
  return res.status(400).json({ message: "Vendor ID is required." });
}

      // Check for attachments (assuming attachments are sent as an array of base64 strings)
      if (!attachments || attachments.length === 0) {
        return res.status(400).json({ message: "No files uploaded!" });
      }
    
      // Parse boolean fields
      const landlordBoolean = parseBoolean(landlord);
      const vendorBoolean = parseBoolean(vendor);
      const dnrvfnBoolean = parseBoolean(dnrvfn);
      const ldhorBoolean = parseBoolean(ldhor);
    
      try {
        // Validate required fields
   
    
        // Check if another vendor with the same email exists (excluding the current vendor)
      
    
        // If account is to be (re)created/updated, hash the new password
        let hashedPassword: string | undefined = undefined;
        if (accountOption === "createAccount" && password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }
        const VendorId = id;
        // Update the vendor in the database
        const updatedVendor = await prisma.vendor.update({
          where: { id: VendorId },
          data: {
            landlord: landlordBoolean,
            vendor: vendorBoolean,
            type,
            title,
            firstName,
            lastName,
            company,
            salutation,
            postCode,
            addressLine1,
            addressLine2,
            town,
            country,
            phoneHome,
            phoneMobile,
            fax,
            email,
            website,
            pager,
            birthplace,
            nationality,
            passportNumber,
            acceptLHA,
            dnrvfn: dnrvfnBoolean,
            label,
            status,
            branch,
            source,
            ldhor: ldhorBoolean,
            salesFee,
            managementFee,
            findersFee,
            salesFeeA,
            managementFeeA,
            findersFeeA,
            nrlRef,
            nrlTax,
            nrlRate,
            vatNumber,
            landlordFullName,
            landlordContact,
            comments,
            otherInfo,
            bankBody,
            bankAddressLine1,
            bankAddressLine2,
            bankTown,
            bankPostCode,
            bankCountry,
            bankIban,
            bic,
            nib,
            accountOption,
            username,
            password: hashedPassword,
            existingUsername,
            attachments, // Store the base64 file strings (or file paths) in the database
            phoneWork,
            negotiator,
          },
        });
    
        return res.status(200).send({
          message: "Vendor updated successfully!",
          vendor: updatedVendor,
        });
      } catch (err) {
        console.error("Error updating vendor:", err);
        return res.status(500).send({ message: "Internal Server Error", error: err });
      }
    }
  
  
  // Delete Vendor
  static async deleteVendor(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      await prisma.vendor.delete({ where: { id: String(id) } });
      return res.status(204).send(); // Successfully deleted
    } catch (err) {
      console.error("Error deleting vendor:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export default VendorController;
