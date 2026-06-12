<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Product;

class StockMovement extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function getType() {
        return match($this->type) {
            'in' => 'Entrée',
            'out' => 'Sortie',
        }
    }
}
