<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'password_confirmation' =>'required|string|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->json()->get('name'),
            'email' => $request->json()->get('email'),
            'password' => Hash::make($request->json()->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user', 'token'), 201);
    }

    public function login(Request $request) {
        $credentials = $request->json()->all();

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could not create token'], 500);
        }

        $user = auth()->user();
        return response()->json(compact('user', 'token'));
    }

    public function getAuthenticatedUser() {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }
    public function show($id)
    {
        // Tìm người dùng theo ID
        $user = User::find($id);

        // Kiểm tra xem người dùng có tồn tại không
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tìm thấy.'], 404);
        }

        // Trả về thông tin người dùng với mã 200
        return response()->json($user, 200);
    }

    public function update(Request $request, $id)
    {
        // Tìm người dùng theo id
        $user = User::find($id);

        // Kiểm tra xem người dùng có tồn tại không
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tìm thấy.'], 404);
        }

        // Xác thực dữ liệu đầu vào (bạn có thể tùy chỉnh theo nhu cầu)
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
        ]);

        // Cập nhật thông tin người dùng
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->save();

        return response()->json(['message' => 'Cập nhật thành công.', 'user' => $user], 200);
    }

    public function changePassword(Request $request, $id)
    {
        // Xác thực các dữ liệu đầu vào
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:5|confirmed', // 8 ký tự trở lên và xác nhận
        ]);

        // Tìm người dùng theo ID
        $user = User::find($id);

        // Kiểm tra xem người dùng có tồn tại không
        if (!$user) {
            return response()->json(['error' => 'Người dùng không tồn tại.'], 404);
        }

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Mật khẩu hiện tại không chính xác.'], 401);
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Mật khẩu đã được thay đổi thành công.']);
    }



}
