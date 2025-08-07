<?php

namespace App\Controllers\Web;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;

class HomeController extends BaseController
{
    public function index(Request $request): Response
    {
        return $this->view('home', [
            'title' => 'CineRequest SaaS - Sistema de Solicitação de Filmes e Séries'
        ]);
    }
}