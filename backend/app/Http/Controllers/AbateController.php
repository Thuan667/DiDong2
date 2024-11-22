<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Abate; // Gọi model Abate
use Tymon\JWTAuth\Facades\JWTAuth; // Import JWTAuth

class AbateController extends Controller
{
    /**
     * Lưu đơn hàng
     */
    public function store(Request $request)
{
    try {
        // Lấy thông tin từ token
        $user = JWTAuth::parseToken()->authenticate();

        // Validate dữ liệu đầu vào
        $request->validate([
            'products' => 'required|array',
            'products.*.name' => 'required|string|max:255',
            'products.*.price' => 'required|numeric|min:0',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.size' => 'required|string|max:255',
            'products.*.image' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'email' => 'required|email|max:255', // Thêm validation cho email
            'totalMoney' => 'required|numeric|min:0',
            'provinces' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'wards' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);




        // Ghi log dữ liệu nhận được
        \Log::info('Checkout request data:', $request->all());

        // Tạo một đối tượng Abate mới
     // Lưu dữ liệu vào cơ sở dữ liệu
     $abate = new Abate();
     $abate->name = $request->name;
     $abate->phone = $request->phone;
     $abate->email = $request->email; // Thêm email vào
     $abate->totalMoney = $request->totalMoney;
     $abate->products = json_encode($request->products);
     $abate->provinces = $request->provinces;
     $abate->district = $request->district;
     $abate->wards = $request->wards;
     $abate->address = $request->address;

     $abate->save();


     $abate->save();


$abate->save();


        // Lưu đơn hàng
        $abate->save();

        return response()->json(['message' => 'Checkout successful', 'products' => $request->products], 200);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Token is absent or invalid'], 401);
    } catch (\Exception $e) {
        // Ghi lại lỗi và trả về phản hồi lỗi 500
        \Log::error('Error processing checkout: ' . $e->getMessage());
        return response()->json(['message' => 'Error processing checkout', 'error' => $e->getMessage()], 500);
    }

    }

    public function getAll()
    {
        return Abate::all();
    }

    public function getAbateById($id)
    {
        return Abate::find($id);
    }

    public function delete($id)
    {
        $abate = Abate::find($id);  // Tìm bản ghi với id
        if ($abate) {
            $abate->delete();  // Xóa bản ghi nếu tìm thấy
            return response()->json(['message' => 'Xóa thành công!'], 200);
        } else {
            return response()->json(['message' => 'Bản ghi không tồn tại!'], 404);
        }
    }
}
