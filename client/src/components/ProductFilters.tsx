import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateFilter, clearFilters } from '@/store/productSlice';
import { type ProductType } from '@/types/schema';

const categories: { name: string; value: ProductType }[] = [
  { name: 'Shoes', value: 'Shoes' },
  { name: 'Handbags', value: 'Handbag' },
  { name: 'Makeup', value: 'Makeup' },
  { name: 'Accessories', value: 'Accessory' },
  { name: 'Clothing', value: 'Clothing' },
];

const priceRanges = [
  { name: 'Under $50', min: 0, max: 50 },
  { name: '$50 - $100', min: 50, max: 100 },
  { name: '$100 - $200', min: 100, max: 200 },
  { name: 'Over $200', min: 200, max: Infinity },
];

const brands = ['Nike', 'Adidas', 'Gucci', 'Chanel', 'Ray-Ban', 'Levi\'s', 'Tiffany'];

export function ProductFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.products.filters);

  const [selectedCategories, setSelectedCategories] = useState<ProductType[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  const handleCategoryChange = (category: ProductType, checked: boolean) => {
    const newCategories = checked 
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newCategories);
    dispatch(updateFilter({ key: 'type', value: newCategories[0] || undefined }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brand]
      : selectedBrands.filter(b => b !== brand);
    
    setSelectedBrands(newBrands);
    dispatch(updateFilter({ key: 'brand', value: newBrands[0] || undefined }));
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(range);
    const priceRange = priceRanges.find(r => r.name === range);
    if (priceRange) {
      dispatch(updateFilter({ key: 'minPrice', value: priceRange.min }));
      dispatch(updateFilter({ key: 'maxPrice', value: priceRange.max === Infinity ? undefined : priceRange.max }));
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange('');
    dispatch(clearFilters());
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.value, checked as boolean)
                  }
                />
                <Label htmlFor={category.value} className="text-sm">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.name} className="flex items-center space-x-2">
                <Checkbox
                  id={range.name}
                  checked={selectedPriceRange === range.name}
                  onCheckedChange={(checked) => 
                    checked ? handlePriceRangeChange(range.name) : setSelectedPriceRange('')
                  }
                />
                <Label htmlFor={range.name} className="text-sm">
                  {range.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <h4 className="font-medium mb-3">Brand</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand, checked as boolean)
                  }
                />
                <Label htmlFor={brand} className="text-sm">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium mb-3">Rating</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="4plus" />
              <Label htmlFor="4plus" className="text-sm">4+ Stars</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="3plus" />
              <Label htmlFor="3plus" className="text-sm">3+ Stars</Label>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleClearFilters}
          variant="outline" 
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
