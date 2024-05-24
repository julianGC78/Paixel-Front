const headerContent = `

            <a href="../view/home.html">
                  <div class="logo">
                        <img src="../images/paixel_P_T.png" alt="logo">
                  
                  </div>
            </a>
            <nav class="menu">
                  <div id="adminPanelButton" style="display: none;">
                        <a href="admin.html" id="goToAdminPanel">Panel Admin</a>
                  </div>
                  <div class="m1"><a class="linea">Cursos</a>
                        <span class="material-symbols-outlined">
                              expand_more
                        </span>
                        <div class="submenu">                          
                              <div class="column">
                                    <a href="allCursos.html">Todos los cursos</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=3">Diseño Gráfico</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=4">Photoshop</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=5">Desarrollo Web</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=6">UI/UX</a>
                              </div>
                              <div class="column">                                  
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=7">Logotipos y Branding</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=8">Ilustración</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=9">3D y Animación</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=10">Introducción a Figma</a>
                                    <a href="http://127.0.0.1:5500/view/curso.html?id=11">Composición y FX</a>
                              </div>
                        </div>
                  </div>
                  <div class="m2"><a class="linea" href="tarifas.html">Tarifas</a></div>
                  <div class="m3"><a class="linea" href="workshop.html">Workshop</a></div>
                  <div class="m4"><a class="linea" href="noticias.html">Noticias</a></div>
                   <div class="m5">
            <a href="login.html">
                  <img src="../images/usuario1.png" alt="usuario">
            </a>
            <div class="submenu-m5" style="display: none;">
                  <a href="misCursos.html">Mis Cursos</a>
                  <a href="perfilUsuario.html" class="profile-link">Perfil</a>
                  <a id="logoutLink" href="#">Cerrar Sesión</a>
            </div>
      </div>
      </div>
      <div class="marca"></div>
</nav>
`
export { headerContent };