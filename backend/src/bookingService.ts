import fs from 'fs';
import { Guest, CabanaBooking } from './types';

export class BookingService {
  private guests: Guest[] = [];

  // Simple in-memory store: cabanaId → booking details
  private bookings = new Map<string, CabanaBooking>();

  constructor(bookingsFilePath: string) {
    // 1. Check file exists
    if (!fs.existsSync(bookingsFilePath)) {
      throw new Error(`Bookings file not found: ${bookingsFilePath}`);
    }

    // 2. Read and parse the file
    const raw = fs.readFileSync(bookingsFilePath, 'utf-8');
    
    // bookings.json is a plain array: [{ room, guestName }, ...]
    this.guests = JSON.parse(raw) as Guest[];

    console.log(`Loaded ${this.guests.length} guests from bookings file`);
  }

  // Check if room + guestName match a real guest
  isValidGuest(room: string, guestName: string): boolean {
    return this.guests.some(
      g =>
        g.room.toLowerCase() === room.toLowerCase() &&
        g.guestName.toLowerCase() === guestName.toLowerCase()
    );
  }

  // Try to book a cabana
  bookCabana(
    cabanaId: string,
    room: string,
    guestName: string
  ): { success: boolean; error?: string; booking?: CabanaBooking } {
    // Already booked?
    if (this.bookings.has(cabanaId)) {
      return { success: false, error: 'This cabana is already booked.' };
    }

    // Create the booking
    const booking: CabanaBooking = {
      cabanaId,
      room,
      guestName,
      bookedAt: new Date().toISOString(),
    };

    this.bookings.set(cabanaId, booking);
    return { success: true, booking };
  }

  // Return all booked cabana IDs
  getBookedIds(): Set<string> {
    return new Set(this.bookings.keys());
  }
}