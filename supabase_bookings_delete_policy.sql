-- Add DELETE policy for bookings table
-- This allows authenticated users (admins) to delete bookings

CREATE POLICY "bookings_delete"
ON public.bookings
FOR DELETE
TO authenticated
USING (true);
