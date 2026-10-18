<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professionals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('service')->index(); // oficio: Electricidad, Plomería...
            $table->text('description');
            $table->string('neighborhood');
            $table->decimal('rating', 2, 1)->nullable(); // dato ficticio de demo
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professionals');
    }
};
