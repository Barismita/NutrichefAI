import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function PantryTable({ ingredients }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Expiry</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.name}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{ingredient.quantity}</TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                        <TableCell>{ingredient.category}</TableCell>
                        <TableCell>{ingredient.expiry_date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
