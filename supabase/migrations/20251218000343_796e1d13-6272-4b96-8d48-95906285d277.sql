-- Add explicit UPDATE policy - users can only update their own orders (for status updates if needed)
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add explicit DELETE policy - deny all deletes (orders should be preserved for records)
CREATE POLICY "No one can delete orders"
ON public.orders
FOR DELETE
USING (false);