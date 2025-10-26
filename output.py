# Código traducido de Java a Python
# Clase original: ProgramaCompleto
# Generado por JavaBridge

def main():
    numero = 42
    decimal = 3.14
    letra = 'A'
    mensaje = "Hola Mundo"
    activo = True
    suma = (10 + 5)
    resta = (20 - 8)
    multiplicacion = (6 * 7)
    division = (100 // 4)
    modulo = (15 % 4)
    print("=== PROGRAMA DE PRUEBA COMPLETO ===")
    print(mensaje)
    print(("Numero: " + numero))
    print(("Decimal: " + decimal))
    print(("Letra: " + letra))
    if (numero > 40):
        print("El numero es mayor a 40")
    else:
        print("El numero es menor o igual a 40")
    condicion1 = ((numero > 30) and (decimal < 5))
    condicion2 = ((letra == 'A') or (letra == 'B'))
    condicion3 = not (activo)
    if condicion1:
        print("Condicion 1 es verdadera")
    if condicion2:
        print("Condicion 2 es verdadera")
    print("Contando del 0 al 4:")
    for i in range(0, 5):
        print(i)
    print("Contando del 10 al 6:")
    j = 10
    while (j > 5):
        print(j)
        j -= 1
    contador = 0
    print("Usando WHILE:")
    while (contador < 3):
        print(("Contador: " + contador))
        contador += 1
    valor = 0
    print("Usando DO-WHILE:")
    while True:
        print(("Valor: " + valor))
        valor += 1
        if not ((valor < 3)):
            break
    if (suma > resta):
        print("Suma es mayor que resta")
    if (multiplicacion >= division):
        print("Multiplicacion es mayor o igual")
    if (modulo != 0):
        print("El modulo no es cero")
    a = None
    b = None
    c = None
    a = 1
    b = 2
    c = 3
    x = 100
    y = 200
    z = 300
    resultado = (((a + b) * c) - (x // y))
    complejo = (((a < b) and (c > 0)) or ((x == 100) and (y != 0)))
    numero += 1
    decimal -= 1
    if (resultado > 0):
        if complejo:
            print("Resultado positivo y condicion compleja verdadera")
        else:
            print("Resultado positivo pero condicion compleja falsa")
    else:
        print("Resultado negativo o cero")
    print("=== FIN DEL PROGRAMA ===")

if __name__ == "__main__":
    main()
