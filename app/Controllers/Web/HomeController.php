<?php

namespace App\Controllers\Web;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;

class HomeController extends BaseController
{
    public function index(Request $request): Response
    {
        $content = file_get_contents(__DIR__ . '/../../../resources/views/home.php');
        return new Response($content, 200, ['Content-Type' => 'text/html']);
    }
}