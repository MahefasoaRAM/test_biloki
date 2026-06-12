<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\StockMovement;

class Product extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function getStockStatus() {
        if($this->stock_quantity <= 0) {
            return 'en rupture';
        }
        if($this->stock_quantity <= $this-> stock_minimum) {
            return 'stock faible';
        }
        return 'disponible';
    }

    public function stockMovements() {
        return $this->HasMany(StockMovement::class);
    }
}
