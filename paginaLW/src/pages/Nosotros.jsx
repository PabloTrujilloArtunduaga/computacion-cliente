import React from "react"

export default function Nosotros() {
  return (
    <div style={{ backgroundColor: "#fafafa", padding: "80px 0" }}>
      <div className="container" style={{ maxWidth: "900px" }}>

        {/* TÍTULO PRINCIPAL */}
        <h2
          className="center-align"
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "3rem",
            fontWeight: "600",
            marginBottom: "60px",
            color: "#b8860b",
          }}
        >
          Sobre Nosotros
        </h2>

        {/* HISTORIA */}
        <div className="card z-depth-3" style={cardStyle}>
          <div className="card-content">
            <span className="card-title" style={cardTitleStyle}>
              Nuestra Historia
            </span>
            <p style={paragraphStyle}>
              Nuestro estanco nació con una visión clara: ofrecer un espacio donde 
              la calidad, la confianza y el servicio cercano sean los protagonistas. 
              Desde nuestros primeros días, nos enfocamos en brindar productos de tabaco, 
              licores y accesorios cuidadosamente seleccionados, siempre cumpliendo con 
              la normatividad y priorizando la experiencia del cliente.

              <br /><br />
              Con el tiempo, nos hemos convertido en un referente local gracias a la calidez 
              de nuestro trato y la variedad de productos que ofrecemos. Hoy seguimos 
              evolucionando, adaptándonos a nuevas tendencias y buscando siempre un equilibrio 
              entre tradición, estilo y responsabilidad.
            </p>
          </div>
        </div>

        {/* MISIÓN */}
        <div className="card z-depth-3" style={cardStyle}>
          <div className="card-content">
            <span className="card-title" style={cardTitleStyle}>
              Misión
            </span>
            <p style={paragraphStyle}>
              Ofrecer a nuestros clientes una experiencia de compra confiable, moderna y 
              responsable; brindando productos de alta calidad acompañados de una atención 
              cercana y personalizada. Buscamos ser ese lugar donde quienes disfrutan los 
              buenos momentos, lo hagan con estilo y conciencia.
            </p>
          </div>
        </div>

        {/* VISIÓN */}
        <div className="card z-depth-3" style={cardStyle}>
          <div className="card-content">
            <span className="card-title" style={cardTitleStyle}>
              Visión
            </span>
            <p style={paragraphStyle}>
              Ser el estanco líder en la región, reconocido por su compromiso con el 
              consumo responsable, su excelencia en servicio y su constante capacidad de 
              innovar. Aspiramos a ofrecer una experiencia segura, cálida y moderna tanto 
              en nuestra tienda física como en nuestras plataformas digitales.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Estilos en línea

const cardStyle = {
  borderRadius: "14px",
  padding: "5px",
  marginBottom: "40px",
  backgroundColor: "#fafafa",
}

const cardTitleStyle = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: "2rem",
  fontWeight: "600",
  color: "#b8860b",
  marginBottom: "20px",
}

const paragraphStyle = {
  fontFamily: "'Lora', serif",
  color: "#4a4340",
  fontSize: "1.15rem",
  lineHeight: "1.8",
  textAlign: "justify",
}
