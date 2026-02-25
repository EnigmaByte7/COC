# Clash of Code
### Clash of code is a 1v1 live coding contest platform... built on NextJS, Express, Redis, Judge0 , MongoDB, Redis streams , nginx and socket.io

## Future Improvements
- ~~this ui is test only, so ui needs generous improvements~~
- ~~some known issues, state is not preserved for now, so reloading of match page will wipe eveerythig~~
- ~~timer is yet to be added~~
- ~~and much more... in testing right now~~

👻

## Changelog _Oct 22, 2025 v1.0.1_
- updated architecture
- now have multiple socket io server load balanced by a nginx proxy
- uses the Redis addapter in socket io to handle scalability
- had to ensure session affinity as stated in the socket io docs for using multiple nodes
- much scalable now
- ~~see the new design..https://app.eraser.io/workspace/GetTMBOb99Sk3KImaK2T?origin=share~~

## Changelog Feb, 2026

#### Significant changes in design and architecture, most of the pending features are now implemented and tested. Below is a summary of said changes

- Reconnection and resyncing of match state is now supported
- timer is now supported
- also added a feature to send reactions during the match
- socket layer now has a middleware for identity management
- data is persisting now
- e2e tests were performed
- replaced kafka with redis streams
- new design [here](https://app.eraser.io/workspace/GetTMBOb99Sk3KImaK2T?origin=share)


## Screenshots

![](/screenshots/1.png)
![](/screenshots/2.png)
![](/screenshots/3.png)
![](/screenshots/4.png)
![](/screenshots/5.png)