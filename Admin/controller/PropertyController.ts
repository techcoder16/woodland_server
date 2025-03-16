import prisma from "../config/db.config";
import { Request, Response } from "express";

// Custom interface for Property Data
interface PropertyData {
  id?: string;
  for?: string;
  category?: string;
  propertyType?: string;
  internalReference?: string;
  price?: string;
  priceQualifier?: string;
  tenure?: string;
  contractType?: string;
  salesFee?: string;
  postCode?: string;
  propertyNo?: string;
  propertyName?: string;
  addressLine1?: string;
  addressLine2?: string;
  town?: string;
  county?: string;
  country: string;
  latitude?: string;
  longitude?: string;
  development?: string;
  yearOfBuild?: string;
  parking?: string;
  garden?: string;
  livingFloorSpace?: string;
  meetingRooms?: string;
  workStation?: string;
  landSize?: string;
  outBuildings?: string;
  propertyFeature: string[];
  Tags?: string;
  shortSummary?: string;
  fullDescription?: string;
  rooms: any; // Expects JSON (e.g., an array of objects)
  Solicitor?: string;
  GuaranteedRentLandlord?: string;
  Branch?: string;
  Negotiator?: string;
  whodoesviewings?: string;
  comments?: string;
  sva?: string;
  tenureA?: string;
  customGarden?: string;
  customParking?: string;
  pets?: string;
  train?: string;
  occupant?: string;
  occupantEmail?: string;
  occupantMobile?: string;
  moreInfo?: string;
  council?: string;
  councilBrand?: string;
  freeholder?: string;
  freeholderContract?: string;
  freeholderAddress?: string;
  nonGasProperty?: boolean;
  Insurer?: string;
  photographs: string;
  floorPlans: string;
  epcChartOption: string;
  currentEERating?: string;
  potentialEERating?: string;
  epcChartFile?: string;
  epcReportOption: string;
  epcReportFile?: string;
  epcReportURL?: string;
  videoTourDescription?: string;
  showOnWebsite?: boolean;
  attachments: string[];
  publishOnWeb?: string;
  status?: string;
  detailPageUrl?: string;
  publishOnPortals?: string;
  portalStatus?: string;
  forA?: string;
  propertyTypeA?: string;
  newHome?: boolean;
  offPlan?: boolean;
  virtualTour?: string;
  enterUrl?: string;
  virtualTour2?: string;
  enterUrl2?: string;
  propertyBrochureUrl?: string;
  AdminFee?: string;
  ServiceCharges?: string;
  minimumTermForLet?: string;
  annualGroundRent?: string;
  lengthOfLease?: string;
  shortSummaryForPortals?: string;
  fullDescriptionforPortals?: string;
  sendToBoomin?: boolean;
  sendToRightmoveNow?: boolean;
  CustomDisplayAddress?: string;
  transactionType?: string;
  sendToOnTheMarket?: boolean;
  newsAndExclusive?: boolean;
  selectPortals?: string[];

  vendor?: string; // Vendor relation ID (if applicable)
}

const parseBoolean = (value: any) => {
  console.log(value)

  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
};

class PropertyController {

  // Create a new property
  static async createProperty(req: Request<{}, {}, PropertyData>, res: Response) {
    const {
      for: propertyFor,
      category,
      propertyType,
      internalReference,
      price,
      priceQualifier,
      tenure,
      contractType,
      salesFee,
      postCode,
      propertyNo,
      propertyName,
      addressLine1,
      addressLine2,
      town,
      county,
      country,
      latitude,
      longitude,
      development,
      yearOfBuild,
      parking,
      garden,
      livingFloorSpace,
      meetingRooms,
      workStation,
      landSize,
      outBuildings,
      propertyFeature,
      Tags,
      shortSummary,
      fullDescription,
      rooms,
      Solicitor,
      GuaranteedRentLandlord,
      Branch,
      Negotiator,
      whodoesviewings,
      comments,
      sva,
      tenureA,
      customGarden,
      customParking,
      pets,
      train,
      occupant,
      occupantEmail,
      occupantMobile,
      moreInfo,
      council,
      councilBrand,
      freeholder,
      freeholderContract,
      freeholderAddress,
      nonGasProperty,
      Insurer,
      photographs,
      floorPlans,
      epcChartOption,
      currentEERating,
      potentialEERating,
      epcChartFile,
      epcReportOption,
      epcReportFile,
      epcReportURL,
      videoTourDescription,
      showOnWebsite,
      attachments,
      publishOnWeb,
      status,
      detailPageUrl,
      publishOnPortals,
      portalStatus,
      forA,
      propertyTypeA,
      newHome,
      offPlan,
      virtualTour,
      enterUrl,
      virtualTour2,
      enterUrl2,
      propertyBrochureUrl,
      AdminFee,
      ServiceCharges,
      minimumTermForLet,
      annualGroundRent,
      lengthOfLease,
      shortSummaryForPortals,
      fullDescriptionforPortals,
      sendToBoomin,
      sendToRightmoveNow,
      CustomDisplayAddress,
      transactionType,
      sendToOnTheMarket,
      newsAndExclusive,
      selectPortals,
      vendor,
    } = req.body;

 

    // Check for required fields (postCode and country are mandatory in the model)
    if (!postCode || !country) {
      return res.status(400).json({ message: "Post Code and Country are required!" });
    }

    // Example: Check that attachments are provided (if necessary)
    if (!attachments || attachments.length === 0) {
      return res.status(400).json({ message: "No attachments uploaded!" });
    }

    try {
      const newProperty = await prisma.property.create({
        data: {
          for: propertyFor,
          category,
          propertyType,
          internalReference,
          price,
          priceQualifier,
          tenure,
          contractType,
          salesFee,
          postCode,
          propertyNo,
          propertyName,
          addressLine1,
          addressLine2,
          town,
          county,
          country,
          latitude,
          longitude,
          development,
          yearOfBuild,
          parking,
          garden,
          livingFloorSpace,
          meetingRooms,
          workStation,
          landSize,
          outBuildings,
          propertyFeature,
          Tags,
          shortSummary,
          fullDescription,
          rooms,
          Solicitor,
          GuaranteedRentLandlord,
          Branch,
          Negotiator,
          whodoesviewings,
          comments,
          sva,
          tenureA,
          customGarden,
          customParking,
          pets,
          train,
          occupant,
          occupantEmail,
          occupantMobile,
          moreInfo,
          council,
          councilBrand,
          freeholder,
          freeholderContract,
          freeholderAddress,
          nonGasProperty: parseBoolean(nonGasProperty),
          Insurer,
          photographs,
          floorPlans,
          epcChartOption,
          currentEERating,
          potentialEERating,
          epcChartFile,
          epcReportOption,
          epcReportFile,
          epcReportURL,
          videoTourDescription,
          
          showOnWebsite: parseBoolean(showOnWebsite),
          attachments,
          publishOnWeb,
          status,
          detailPageUrl,
          publishOnPortals,
          portalStatus,
          forA,
          propertyTypeA,
          newHome: parseBoolean(newHome),
          offPlan:parseBoolean(offPlan),
          virtualTour,
          enterUrl,
          virtualTour2,
          enterUrl2,
          propertyBrochureUrl,
          AdminFee,
          ServiceCharges,
          minimumTermForLet,
          annualGroundRent,
          lengthOfLease,
          shortSummaryForPortals,
          fullDescriptionforPortals,
          sendToBoomin:parseBoolean(sendToBoomin),
          sendToRightmoveNow:parseBoolean(sendToRightmoveNow),
          CustomDisplayAddress,
          transactionType,
          sendToOnTheMarket:parseBoolean(sendToOnTheMarket),
          newsAndExclusive:parseBoolean(newsAndExclusive),
          selectPortals,
          // If a vendor ID is provided, connect the relation
   

          vendor: vendor ? { connect: { id: vendor } } : undefined,
        },
      });

      return res.status(201).json({
        message: "Property created successfully!",
        property: newProperty,
      });
    } catch (err) {
      console.error("Error creating property:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Get properties with Pagination and Filters
  static async getProperties(req: Request, res: Response): Promise<Response> {
    const { page = 1, limit = 10, search, category, status, postCode, country } = req.query;
    try {
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
  
      // Build dynamic filters based on query parameters
      const filters: any = {};
      if (search) {
        filters.OR = [
          { propertyName: { contains: search as string, mode: "insensitive" } },
          { internalReference: { contains: search as string, mode: "insensitive" } },
          { postCode: { contains: search as string, mode: "insensitive" } },
        ];
      }
      if (category) filters.category = category;
      if (status) filters.status = status;
      if (postCode) filters.postCode = { contains: postCode as string, mode: "insensitive" };
      if (country) filters.country = { contains: country as string, mode: "insensitive" };
  
      const properties = await prisma.property.findMany({
        where: filters,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });
  
      const totalProperties = await prisma.property.count({
        where: filters,
      });
  
      return res.json({
        properties,
        total: totalProperties,
        page: pageNumber,
        totalPages: Math.ceil(totalProperties / limitNumber),
      });
    } catch (err) {
      console.error("Error fetching properties:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  

  // Update an existing property
  static async updateProperty(req: Request<{ id: string }, {}, PropertyData>, res: Response) {

    const {
      id,
      for: propertyFor,
      category,
      propertyType,
      internalReference,
      price,
      priceQualifier,
      tenure,
      contractType,
      salesFee,
      postCode,
      propertyNo,
      propertyName,
      addressLine1,
      addressLine2,
      town,
      county,
      country,
      latitude,
      longitude,
      development,
      yearOfBuild,
      parking,
      garden,
      livingFloorSpace,
      meetingRooms,
      workStation,
      landSize,
      outBuildings,
      propertyFeature,
      Tags,
      shortSummary,
      fullDescription,
      rooms,
      Solicitor,
      GuaranteedRentLandlord,
      Branch,
      Negotiator,
      whodoesviewings,
      comments,
      sva,
      tenureA,
      customGarden,
      customParking,
      pets,
      train,
      occupant,
      occupantEmail,
      occupantMobile,
      moreInfo,
      council,
      councilBrand,
      freeholder,
      freeholderContract,
      freeholderAddress,
      nonGasProperty,
      Insurer,
      photographs,
      floorPlans,
      epcChartOption,
      currentEERating,
      potentialEERating,
      epcChartFile,
      epcReportOption,
      epcReportFile,
      epcReportURL,
      videoTourDescription,
      showOnWebsite,
      attachments,
      publishOnWeb,
      status,
      detailPageUrl,
      publishOnPortals,
      portalStatus,
      forA,
      propertyTypeA,
      newHome,
      offPlan,
      virtualTour,
      enterUrl,
      virtualTour2,
      enterUrl2,
      propertyBrochureUrl,
      AdminFee,
      ServiceCharges,
      minimumTermForLet,
      annualGroundRent,
      lengthOfLease,
      shortSummaryForPortals,
      fullDescriptionforPortals,
      sendToBoomin,
      sendToRightmoveNow,
      CustomDisplayAddress,
      transactionType,
      sendToOnTheMarket,
      newsAndExclusive,
      selectPortals,
      vendor,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Property ID is required." });
    }

    // Check for attachments (if applicable)
    if (!attachments || attachments.length === 0) {
      return res.status(400).json({ message: "No attachments uploaded!" });
    }
    console.log(showOnWebsite);
    try {
      const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
          for: propertyFor,
          category,
          propertyType,
          internalReference,
          price,
          priceQualifier,
          tenure,
          contractType,
          salesFee,
          postCode,
          propertyNo,
          propertyName,
          addressLine1,
          addressLine2,
          town,
          county,
          country,
          latitude,
          longitude,
          development,
          yearOfBuild,
          parking,
          garden,
          livingFloorSpace,
          meetingRooms,
          workStation,
          landSize,
          outBuildings,
          propertyFeature,
          Tags,
          shortSummary,
          fullDescription,
          rooms,
          Solicitor,
          GuaranteedRentLandlord,
          Branch,
          Negotiator,
          whodoesviewings,
          comments,
          sva,
          tenureA,
          customGarden,
          customParking,
          pets,
          train,
          occupant,
          occupantEmail,
          occupantMobile,
          moreInfo,
          council,
          councilBrand,
          freeholder,
          freeholderContract,
          freeholderAddress,
          nonGasProperty: parseBoolean(nonGasProperty),
          Insurer,
          photographs,
          floorPlans,
          epcChartOption,
          currentEERating,
          potentialEERating,
          epcChartFile,
          epcReportOption,
          epcReportFile,
          epcReportURL,
          videoTourDescription,
          showOnWebsite: parseBoolean(showOnWebsite),
          attachments,
          publishOnWeb,
          status,
          detailPageUrl,
          publishOnPortals,
          portalStatus,
          forA,
          propertyTypeA,
          newHome:parseBoolean(newHome),
          offPlan:parseBoolean(offPlan),
          virtualTour,
          enterUrl,
          virtualTour2,
          enterUrl2,
          propertyBrochureUrl,
          AdminFee,
          ServiceCharges,
          minimumTermForLet,
          annualGroundRent,
          lengthOfLease,
          shortSummaryForPortals,
          fullDescriptionforPortals,
          sendToBoomin:parseBoolean(sendToBoomin),
          sendToRightmoveNow:parseBoolean(sendToRightmoveNow),
          CustomDisplayAddress,
          transactionType,
          sendToOnTheMarket:parseBoolean(sendToOnTheMarket),
          newsAndExclusive:parseBoolean(newsAndExclusive),
          selectPortals,
          vendor: vendor ? { connect: { id: vendor } } : undefined,
        },
      });

      return res.status(200).json({
        message: "Property updated successfully!",
        property: updatedProperty,
      });
    } catch (err) {
      // console.error("Error updating property:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }

  // Delete a property
  static async deleteProperty(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      await prisma.property.delete({ where: { id: String(id) } });
      return res.status(204).send();
    } catch (err) {
      console.error("Error deleting property:", err);
      return res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
}

export default PropertyController;
