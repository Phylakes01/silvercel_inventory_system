import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Fuse from "fuse.js"

const initialProducts = [
  {
    id: 1,
    name: "Pandora Moments Snake Chain Bracelet",
    image: "/images/snake_bracelet.webp",
    category: "Bracelets",
    quantity: 25,
    price: 75.0,
  },
  {
    id: 2,
    name: "Sparkling Heart Halo Ring",
    image: "/images/heart_ring.webp",
    category: "Rings",
    quantity: 40,
    price: 65.0,
  },
  {
    id: 3,
    name: "Timeless Elegance Earrings",
    image: "/images/elegance_earrings.jpg",
    category: "Earrings",
    quantity: 18,
    price: 85.0,
  },
  {
    id: 4,
    name: "Pandora Signature Logo Pendant Necklace",
    image: "/images/pendant_neklace.webp",
    category: "Necklaces",
    quantity: 12,
    price: 99.0,
  },
  {
    id: 5,
    name: "Rose Gold Charm with Pink Crystal",
    image: "/images/charm_with_pink_crystal.webp",
    category: "Charms",
    quantity: 60,
    price: 55.0,
  },
  {
    id: 6,
    name: "Pandora ME Link Chain Necklace",
    image: "/images/link_chain_necklace.webp",
    category: "Necklaces",
    quantity: 10,
    price: 120.0,
  },
];

const categories = ["Bracelets", "Rings", "Earrings", "Necklaces", "Charms"];

// SearchBar Component
function SearchBar({ searchQuery, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by product name or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-lg text-xs sm:text-sm"
        />
      </div>

      {/* Category Select */}
      <Select
        value={category || ""}
        onValueChange={(val) => onCategoryChange(val)}
      >
        <SelectTrigger className="w-40 sm:w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {/* All Categories Option */}
          <SelectItem value="all">All Categories</SelectItem>

          {/* Divider for clarity */}
          <div className="border-t border-border my-1"></div>

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


// ProductCard Component (unchanged)
function ProductCard({ product, onEdit, onDelete }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg py-0 pb-6">
      <div className="relative aspect-square overflow-hidden bg-muted m-5 mb-0 rounded-md">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="flex-1 pb-3">
        <CardTitle className="text-base text-wrap sm:text-lg">{product.name}</CardTitle>
        <CardDescription className="text-sm">{product.category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">Stock: {product.quantity}</Badge>
          <span className="text-lg sm:text-xl font-bold text-primary">₱{product.price.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// AddProductDialog Component (unchanged)
function AddProductDialog({ isOpen, onOpenChange, onAddProduct, categories, editProduct, onEditProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (editProduct && isOpen) {
      setFormData({
        name: editProduct.name,
        category: editProduct.category,
        quantity: editProduct.quantity.toString(),
        price: editProduct.price.toString(),
        image: editProduct.image,
      })
      setImagePreview(editProduct.image)
    } else if (!isOpen) {
      setFormData({ name: "", category: "", quantity: "", price: "", image: "" })
      setImagePreview("")
    }
  }, [editProduct, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      quantity: Number.parseInt(formData.quantity, 10),
      price: Number.parseFloat(formData.price),
      image: imagePreview || "/diverse-products-still-life.png",
    }

    if (editProduct) {
      onEditProduct({ ...productData, id: editProduct.id })
      toast.success("Product updated successfully")
    } else {
      onAddProduct(productData)
      toast.success("Product added successfully")
    }

    setFormData({ name: "", category: "", quantity: "", price: "", image: "" })
    setImagePreview("")
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {editProduct ? "Update the product details below." : "Fill in the details to add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₱)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-2 aspect-square overflow-hidden rounded-lg border border-border bg-muted max-w-[200px]">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-6 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              {editProduct ? "Update Product" : "Add Product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main Products Component
export default function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("") // <-- category state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)

  // Filter products by selected category first (if any)
  const filteredByCategory = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  // Fuse.js setup for fuzzy search (runs on already category-filtered list)
  const fuse = useMemo(() => {
    return new Fuse(filteredByCategory, {
      keys: ["name", "category"],
      threshold: 0.3,
      minMatchCharLength: 1,
    })
  }, [filteredByCategory])

  // Search results (applies fuzzy search to category-filtered list)
  const searchResults = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) {
      return filteredByCategory
    }
    const results = fuse.search(query)
    return results.map((result) => result.item)
  }, [searchQuery, fuse, filteredByCategory])

  const handleAddProduct = (newProduct) => {
    const product = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      ...newProduct,
    }
    setProducts([...products, product])
  }

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setEditProduct(null)
  }

  const handleDeleteProduct = () => {
    if (deleteProduct) {
      setProducts(products.filter((p) => p.id !== deleteProduct.id))
      toast.success("Product deleted successfully")
      setDeleteProduct(null)
    }
  }

  const openEditDialog = (product) => {
    setEditProduct(product)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditProduct(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button onClick={openAddDialog} className="gap-2 w-fit sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search Bar (now with category prop and handler) */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Products Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {searchResults.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={openEditDialog}
              onDelete={(product) => setDeleteProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <AddProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        categories={categories}
        editProduct={editProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteProduct?.name}" from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
