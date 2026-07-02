import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Registration from "@/models/Registration";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sri Lankan phone numbers
const phoneRegex = /^(\+94|0)\d{9}$/;

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { teamName, memberCount, members } = body;

    // Team name
    if (!teamName || teamName.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Team name is required.",
        },
        { status: 400 }
      );
    }

    // Members array
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one member is required.",
        },
        { status: 400 }
      );
    }

    // Member count
    if (memberCount !== members.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Member count does not match the number of members.",
        },
        { status: 400 }
      );
    }

    // Validate each member
    for (const member of members) {
      if (!member.fullName?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Full name is required.",
          },
          { status: 400 }
        );
      }

      if (!member.studentId?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Student ID is required.",
          },
          { status: 400 }
        );
      }

      if (!emailRegex.test(member.email)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid email: ${member.email}`,
          },
          { status: 400 }
        );
      }

      if (!phoneRegex.test(member.contactNumber)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid contact number for ${member.fullName}`,
          },
          { status: 400 }
        );
      }

      if (!phoneRegex.test(member.whatsappNumber)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid WhatsApp number for ${member.fullName}`,
          },
          { status: 400 }
        );
      }
    }

    // Duplicate email check
    const emails = members.map((m: any) => m.email.toLowerCase());

    const existing = await Registration.findOne({
      "members.email": {
        $in: emails,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more email addresses are already registered.",
        },
        { status: 400 }
      );
    }

    const registration = await Registration.create(body);

    return NextResponse.json({
      success: true,
      registration,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed.",
      },
      { status: 500 }
    );
  }
}