import prisma from "../config/db.config";
import { Request, Response } from "express";

// Custom interface for Tenant Data
interface TenantData {
  id?: string;
  title?: string;
  FirstName?: string;
  SureName?: string;
  MobileNo?: string;
  HomePhone?: string;
  WorkPhone?: string;
  Email?: string;
  EmployeeName?: string;
  BankAccountNo?: string;
  SortCode?: string;
  BankName?: string;
  IDCheck?: string;
}

class TenantController {
  // Create a new Tenant
  static async createTenant(req: Request<{}, {}, TenantData>, res: Response) {
    const {
      title,
      FirstName,
      SureName,
      MobileNo,
      HomePhone,
      WorkPhone,
      Email,
      EmployeeName,
      BankAccountNo,
      SortCode,
      BankName,
      IDCheck,
    } = req.body;
console.log(req.body)
    // You can add validation if needed
    try {

      console.log({  title,
        FirstName,
        SureName,
        MobileNo,
        HomePhone,
        WorkPhone,
        Email,
        EmployeeName,
        BankAccountNo,
        SortCode,
        BankName,
        IDCheck,})
      const newTenant = await prisma.tenant.create({
        data: {
          title,
          FirstName,
          SureName,
          MobileNo,
          HomePhone,
          WorkPhone,
          Email,
          EmployeeName,
          BankAccountNo,
          SortCode,
          BankName,
          IDCheck,
        },
      });

      return res.status(201).json({
        message: "Tenant created successfully!",
        Tenant: newTenant,
      });
    } catch (err) {
      console.error("Error creating Tenant:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Get tenants with Pagination and optional search filter
  static async getTenants(req: Request, res: Response): Promise<Response> {
    const { page = 1, limit = 10, search } = req.query;
    try {
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      // Build dynamic filters based on query parameters
      const filters: any = {};
      if (search) {
        filters.OR = [
          { FirstName: { contains: search as string, mode: "insensitive" } },
          { SureName: { contains: search as string, mode: "insensitive" } },
          { Email: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const tenants = await prisma.tenant.findMany({
        where: filters,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });

      const totalTenants = await prisma.tenant.count({
        where: filters,
      });

      return res.json({
        tenants,
        total: totalTenants,
        page: pageNumber,
        totalPages: Math.ceil(totalTenants / limitNumber),
      });
    } catch (err) {
      console.error("Error fetching tenants:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Update an existing Tenant
  static async updateTenant(req: Request<{ id: string }, {}, TenantData>, res: Response) {
 
    const {
      id,
      title,
      FirstName,
      SureName,
      MobileNo,
      HomePhone,
      WorkPhone,
      Email,
      EmployeeName,
      BankAccountNo,
      SortCode,
      BankName,
      IDCheck,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Tenant ID is required." });
    }
console.log(id)
    try {
      const updatedTenant = await prisma.tenant.update({
        where: { id },
        data: {
          title,
          FirstName,
          SureName,
          MobileNo,
          HomePhone,
          WorkPhone,
          Email,
          EmployeeName,
          BankAccountNo,
          SortCode,
          BankName,
          IDCheck,
        },
      });

      return res.status(200).json({
        message: "Tenant updated successfully!",
        Tenant: updatedTenant,
      });
    } catch (err) {
      console.error("Error updating Tenant:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Delete a Tenant
  static async deleteTenant(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const propertyParty = await prisma.propertyParty.findFirst({
        where: { Tenantid: id }
    });

    if (propertyParty) {
        return res.status(400).json({ message: "Tenant cannot be deleted as they are associated with a property parties." });
    }


      await prisma.tenant.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      console.error("Error deleting Tenant:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export default TenantController;
